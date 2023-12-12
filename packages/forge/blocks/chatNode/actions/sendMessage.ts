import { createAction, option } from '@typebot.io/forge'
import { isDefined, isEmpty } from '@typebot.io/lib'
import { got } from 'got'
import { apiBaseUrl } from '../constants'
import { auth } from '../auth'
import { baseOptions } from '../baseOptions'
import { ChatNodeResponse } from '../types'

export const sendMessage = createAction({
  baseOptions,
  auth,
  name: 'Send Message',
  options: option.object({
    botId: option.string.layout({
      label: 'Bot ID',
      placeholder: '68c052c5c3680f63',
      moreInfoTooltip:
        'The bot_id you want to ask question to. You can find it at the end of your ChatBot URl in your dashboard',
    }),
    threadId: option.string.layout({
      label: 'Thread ID',
      moreInfoTooltip:
        'Used to remember the conversation with the user. If empty, a new thread is created.',
    }),
    message: option.string.layout({
      label: 'Message',
      placeholder: 'Hi, what can I do with ChatNode',
      input: 'textarea',
    }),
    responseMapping: option.saveResponseArray(['Message', 'Thread ID']).layout({
      accordion: 'Save response',
    }),
  }),
  getSetVariableIds: ({ responseMapping }) =>
    responseMapping?.map((r) => r.variableId).filter(isDefined) ?? [],
  run: {
    server: async ({
      credentials: { apiKey },
      options: { botId, message, responseMapping, threadId },
      variables,
    }) => {
      const res: ChatNodeResponse = await got
        .post(apiBaseUrl + botId, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          json: {
            message,
            chat_session_id: isEmpty(threadId) ? undefined : threadId,
          },
        })
        .json()

      responseMapping?.forEach((mapping) => {
        if (!mapping.variableId || !mapping.item) return

        if (mapping.item === 'Message')
          variables.set(mapping.variableId, res.message)

        if (mapping.item === 'Thread ID')
          variables.set(mapping.variableId, res.chat_session_id)
      })
    },
  },
})
