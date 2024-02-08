import { HStack } from '@chakra-ui/react'
import React from 'react'
import { BlockIcon } from './BlockIcon'
import { isFreePlan } from '@/features/billing/helpers/isFreePlan'
import { Plan } from '@typebot.io/prisma'
import { useWorkspace } from '@/features/workspace/WorkspaceProvider'
import { BlockLabel } from './BlockLabel'
import { LockTag } from '@/features/billing/components/LockTag'
import { useTranslate } from '@tolgee/react'
import { BubbleBlockType } from '@typebot.io/schemas/features/blocks/bubbles/constants'
import { InputBlockType } from '@typebot.io/schemas/features/blocks/inputs/constants'
import { IntegrationBlockType } from '@typebot.io/schemas/features/blocks/integrations/constants'
import { LogicBlockType } from '@typebot.io/schemas/features/blocks/logic/constants'
import { BlockV6 } from '@typebot.io/schemas'
import { enabledBlocks } from '@typebot.io/forge-repository'
import { BlockCardLayout } from './BlockCardLayout'
import { ForgedBlockCard } from '@/features/forge/ForgedBlockCard'

type Props = {
  type: BlockV6['type']
  tooltip?: string
  isDisabled?: boolean
  children: React.ReactNode
  onMouseDown: (e: React.MouseEvent, type: BlockV6['type']) => void
}

export const BlockCard = (
  props: Pick<Props, 'type' | 'onMouseDown'>
): JSX.Element => {
  const { t } = useTranslate()
  const { workspace } = useWorkspace()

  if (enabledBlocks.includes(props.type as (typeof enabledBlocks)[number])) {
    return (
      <ForgedBlockCard
        type={props.type as (typeof enabledBlocks)[number]}
        onMouseDown={props.onMouseDown}
      />
    )
  }
  switch (props.type) {
    case BubbleBlockType.EMBED:
      return (
        <BlockCardLayout
          {...props}
          tooltip={t('blocks.bubbles.embed.blockCard.tooltip')}
        >
          <BlockIcon type={props.type} />
          <BlockLabel type={props.type} />
        </BlockCardLayout>
      )
    case InputBlockType.FILE:
      return (
        <BlockCardLayout
          {...props}
          tooltip={t('blocks.inputs.fileUpload.blockCard.tooltip')}
        >
          <BlockIcon type={props.type} />
          <HStack>
            <BlockLabel type={props.type} />
            {isFreePlan(workspace) && <LockTag plan={Plan.STARTER} />}
          </HStack>
        </BlockCardLayout>
      )
    case LogicBlockType.SCRIPT:
      return (
        <BlockCardLayout
          {...props}
          tooltip={t('editor.blockCard.logicBlock.tooltip.code.label')}
        >
          <BlockIcon type={props.type} />
          <BlockLabel type={props.type} />
        </BlockCardLayout>
      )
    case LogicBlockType.TYPEBOT_LINK:
      return (
        <BlockCardLayout
          {...props}
          tooltip={t('editor.blockCard.logicBlock.tooltip.typebotLink.label')}
        >
          <BlockIcon type={props.type} />
          <BlockLabel type={props.type} />
        </BlockCardLayout>
      )
    case LogicBlockType.JUMP:
      return (
        <BlockCardLayout
          {...props}
          tooltip={t('editor.blockCard.logicBlock.tooltip.jump.label')}
        >
          <BlockIcon type={props.type} />
          <BlockLabel type={props.type} />
        </BlockCardLayout>
      )
    case IntegrationBlockType.GOOGLE_SHEETS:
      return (
        <BlockCardLayout
          {...props}
          tooltip={t('blocks.integrations.googleSheets.blockCard.tooltip')}
        >
          <BlockIcon type={props.type} />
          <BlockLabel type={props.type} />
        </BlockCardLayout>
      )
    case IntegrationBlockType.GOOGLE_ANALYTICS:
      return (
        <BlockCardLayout
          {...props}
          tooltip={t('blocks.integrations.googleAnalytics.blockCard.tooltip')}
        >
          <BlockIcon type={props.type} />
          <BlockLabel type={props.type} />
        </BlockCardLayout>
      )
    case IntegrationBlockType.WEBHOOK:
      return (
        <BlockCardLayout
          {...props}
          tooltip={t('blocks.integrations.webhook.blockCard.tooltip')}
        >
          <BlockIcon type={props.type} />
          <BlockLabel type={props.type} />
        </BlockCardLayout>
      )
    case IntegrationBlockType.EMAIL:
      return (
        <BlockCardLayout
          {...props}
          tooltip={t('blocks.integrations.email.blockCard.tooltip')}
        >
          <BlockIcon type={props.type} />
          <BlockLabel type={props.type} />
        </BlockCardLayout>
      )
    case IntegrationBlockType.ZAPIER:
      return (
        <BlockCardLayout
          {...props}
          tooltip={t('blocks.integrations.zapier.blockCard.tooltip')}
        >
          <BlockIcon type={props.type} />
          <BlockLabel type={props.type} />
        </BlockCardLayout>
      )
    case IntegrationBlockType.MAKE_COM:
      return (
        <BlockCardLayout
          {...props}
          tooltip={t('blocks.integrations.makeCom.blockCard.tooltip')}
        >
          <BlockIcon type={props.type} />
          <BlockLabel type={props.type} />
        </BlockCardLayout>
      )
    case IntegrationBlockType.PIXEL:
      return (
        <BlockCardLayout
          {...props}
          tooltip={t('blocks.integrations.metaPixel.blockCard.tooltip')}
        >
          <BlockIcon type={props.type} />
          <BlockLabel type={props.type} />
        </BlockCardLayout>
      )
    case IntegrationBlockType.PABBLY_CONNECT:
      return (
        <BlockCardLayout
          {...props}
          tooltip={t('blocks.integrations.pabblyConnect.blockCard.tooltip')}
        >
          <BlockIcon type={props.type} />
          <BlockLabel type={props.type} />
        </BlockCardLayout>
      )
    case IntegrationBlockType.CHATWOOT:
      return (
        <BlockCardLayout
          {...props}
          tooltip={t('blocks.integrations.chatwoot.blockCard.tooltip')}
        >
          <BlockIcon type={props.type} />
          <BlockLabel type={props.type} />
        </BlockCardLayout>
      )
    case IntegrationBlockType.ZEMANTIC_AI:
      return (
        <BlockCardLayout
          {...props}
          tooltip={t('blocks.integrations.zemanticAI.blockCard.tooltip')}
        >
          <BlockIcon type={props.type} />
          <BlockLabel type={props.type} />
        </BlockCardLayout>
      )
    default:
      return (
        <BlockCardLayout {...props}>
          <BlockIcon type={props.type} />
          <BlockLabel type={props.type} />
        </BlockCardLayout>
      )
  }
}
