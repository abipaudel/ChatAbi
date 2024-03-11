import {
  SessionState,
  VariableWithValue,
  ChoiceInputBlock,
} from '@typebot.io/schemas'
import { isDefined } from '@typebot.io/lib'
import { filterChoiceItems } from './filterChoiceItems'
import { deepParseVariables } from '@typebot.io/variables/deepParseVariables'
import { transformVariablesToList } from '@typebot.io/variables/transformVariablesToList'
import { updateVariablesInSession } from '@typebot.io/variables/updateVariablesInSession'

export const injectVariableValuesInButtonsInputBlock =
  (state: SessionState) =>
  (block: ChoiceInputBlock): ChoiceInputBlock => {
    const { variables } = state.typebotsQueue[0].typebot
    if (block.options?.dynamicVariableId) {
      const variable = variables.find(
        (variable) =>
          variable.id === block.options?.dynamicVariableId &&
          isDefined(variable.value)
      ) as VariableWithValue | undefined
      if (!variable) return block
      const value = getVariableValue(state)(variable)
      return {
        ...deepParseVariables(variables)(block),
        items: value.filter(isDefined).map((item, idx) => {
          var result = {
            id: idx.toString(),
            blockId: block.id,
          }

          var contentAsJson;
          try {
            contentAsJson = JSON.parse(item);
          }
          catch
          {
            contentAsJson = false;
          }

          if (contentAsJson
            &&
            (contentAsJson.name && contentAsJson.name !== "") 
            &&
            (contentAsJson.id && contentAsJson.id != "")
          )
          {
            result = Object.assign({}, result, {
              content: contentAsJson.name,
              contentId: contentAsJson.id
            });
          }
          else
          {
            result = Object.assign({}, result, {
              content: item
            });
          }

          return result;
        }),
      }
    }
    return deepParseVariables(variables)(filterChoiceItems(variables)(block))
  }

const getVariableValue =
  (state: SessionState) =>
  (variable: VariableWithValue): (string | null)[] => {
    if (!Array.isArray(variable.value)) {
      const { variables } = state.typebotsQueue[0].typebot
      const [transformedVariable] = transformVariablesToList(variables)([
        variable.id,
      ])
      updateVariablesInSession(state)([transformedVariable])
      return transformedVariable.value as string[]
    }
    return variable.value
  }
