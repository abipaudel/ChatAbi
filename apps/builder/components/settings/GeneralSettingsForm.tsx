import {
  Flex,
  FormLabel,
  Stack,
  Switch,
  Tag,
  useDisclosure,
} from '@chakra-ui/react'
import { ChangePlanModal } from 'components/shared/modals/ChangePlanModal'
import { SwitchWithLabel } from 'components/shared/SwitchWithLabel'
import { useWorkspace } from 'contexts/WorkspaceContext'
import { GeneralSettings } from 'models'
import React from 'react'
import { isFreePlan } from 'services/workspace'
import { isDefined } from 'utils'

type Props = {
  generalSettings: GeneralSettings
  onGeneralSettingsChange: (generalSettings: GeneralSettings) => void
}

export const GeneralSettingsForm = ({
  generalSettings,
  onGeneralSettingsChange,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { workspace } = useWorkspace()
  const isUserFreePlan = isFreePlan(workspace)
  const handleSwitchChange = () => {
    if (generalSettings?.isBrandingEnabled && isUserFreePlan) return
    onGeneralSettingsChange({
      ...generalSettings,
      isBrandingEnabled: !generalSettings?.isBrandingEnabled,
    })
  }

  const handleNewResultOnRefreshChange = (
    isNewResultOnRefreshEnabled: boolean
  ) =>
    onGeneralSettingsChange({
      ...generalSettings,
      isNewResultOnRefreshEnabled,
    })

  const handleInputPrefillChange = (isInputPrefillEnabled: boolean) =>
    onGeneralSettingsChange({
      ...generalSettings,
      isInputPrefillEnabled,
    })

  const handleHideQueryParamsChange = (isHideQueryParamsEnabled: boolean) =>
    onGeneralSettingsChange({
      ...generalSettings,
      isHideQueryParamsEnabled,
    })

  return (
    <Stack spacing={6}>
      <ChangePlanModal isOpen={isOpen} onClose={onClose} />
      <Flex
        justifyContent="space-between"
        align="center"
        onClick={isUserFreePlan ? onOpen : undefined}
      >
        <FormLabel htmlFor="branding" mb="0">
          Typebot.io branding{' '}
          {isUserFreePlan && <Tag colorScheme="orange">Pro</Tag>}
        </FormLabel>
        <Switch
          id="branding"
          isChecked={generalSettings.isBrandingEnabled}
          onChange={handleSwitchChange}
        />
      </Flex>
      <SwitchWithLabel
        id="prefill"
        label="Prefill input"
        initialValue={generalSettings.isInputPrefillEnabled ?? true}
        onCheckChange={handleInputPrefillChange}
        moreInfoContent="Inputs are automatically pre-filled whenever their associated variable has a value"
      />
      <SwitchWithLabel
        id="new-result"
        label="Remember session"
        initialValue={
          isDefined(generalSettings.isNewResultOnRefreshEnabled)
            ? !generalSettings.isNewResultOnRefreshEnabled
            : true
        }
        onCheckChange={handleNewResultOnRefreshChange}
        moreInfoContent="If the user refreshes the page, its existing results will be overwritten. Disable this if you want to create a new results every time the user refreshes the page."
      />
      <SwitchWithLabel
        id="query-params"
        label="Hide query params on bot start"
        initialValue={generalSettings.isHideQueryParamsEnabled ?? true}
        onCheckChange={handleHideQueryParamsChange}
        moreInfoContent="If your URL contains query params, they will be automatically hidden when the bot starts."
      />
    </Stack>
  )
}
