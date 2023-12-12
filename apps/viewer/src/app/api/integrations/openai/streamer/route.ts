import { connect } from '@planetscale/database'
import { env } from '@typebot.io/env'
import { SessionState } from '@typebot.io/schemas'
import { StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { NextResponse } from 'next/dist/server/web/spec-extension/response'
import { getBlockById } from '@typebot.io/lib/getBlockById'
import { forgedBlocks } from '@typebot.io/forge-schemas'
import { decryptV2 } from '@typebot.io/lib/api/encryption/decryptV2'
import { ReadOnlyVariableStore } from '@typebot.io/forge'
import {
  ParseVariablesOptions,
  parseVariables,
} from '@typebot.io/variables/parseVariables'

export const runtime = 'edge'
export const preferredRegion = 'lhr1'
export const dynamic = 'force-dynamic'

const responseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
}

export async function OPTIONS() {
  return new Response('ok', {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Expose-Headers': 'Content-Length, X-JSON',
      'Access-Control-Allow-Headers': '*',
    },
  })
}

export async function POST(req: Request) {
  const { sessionId } = (await req.json()) as {
    sessionId: string
  }

  if (!sessionId)
    return NextResponse.json(
      { message: 'No session ID provided' },
      { status: 400, headers: responseHeaders }
    )

  const conn = connect({ url: env.DATABASE_URL })

  const chatSession = await conn.execute(
    'select state from ChatSession where id=?',
    [sessionId]
  )

  const state = (chatSession.rows.at(0) as { state: SessionState } | undefined)
    ?.state

  if (!state || !state.currentBlockId)
    return NextResponse.json(
      { message: 'No state found' },
      { status: 400, headers: responseHeaders }
    )

  const { group, block } = getBlockById(
    state.currentBlockId,
    state.typebotsQueue[0].typebot.groups
  )
  if (!block || !group)
    return NextResponse.json(
      { message: 'Current block not found' },
      { status: 400, headers: responseHeaders }
    )

  if (!('options' in block))
    return NextResponse.json(
      { message: 'Current block does not have options' },
      { status: 400, headers: responseHeaders }
    )
  const blockDef = forgedBlocks.find((b) => b.id === block.type)
  const action = blockDef?.actions.find((a) => a.name === block.options?.action)

  if (!action || !action.run?.stream)
    return NextResponse.json(
      { message: 'This action does not have a stream function' },
      { status: 400, headers: responseHeaders }
    )

  try {
    if (!block.options.credentialsId) return
    const credentials = (
      await conn.execute('select data, iv from Credentials where id=?', [
        block.options.credentialsId,
      ])
    ).rows.at(0) as { data: string; iv: string } | undefined
    if (!credentials) {
      console.error('Could not find credentials in database')
      return
    }
    const decryptedCredentials = await decryptV2(
      credentials.data,
      credentials.iv
    )
    const variables: ReadOnlyVariableStore = {
      get: (id: string) => {
        const variable = state.typebotsQueue[0].typebot.variables.find(
          (variable) => variable.id === id
        )
        return variable?.value
      },
      parse: (text: string, params?: ParseVariablesOptions) =>
        parseVariables(state.typebotsQueue[0].typebot.variables, params)(text),
    }
    const stream = await action.run.stream.run({
      credentials: decryptedCredentials,
      options: block.options,
      variables,
    })
    if (!stream)
      return NextResponse.json(
        { message: 'Could not create stream' },
        { status: 400, headers: responseHeaders }
      )

    return new StreamingTextResponse(stream, {
      headers: responseHeaders,
    })
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, message } = error
      return NextResponse.json(
        { name, status, message },
        { status, headers: responseHeaders }
      )
    } else {
      throw error
    }
  }
}
