import { addYears } from 'date-fns';
import Axios from 'axios';

import {
  useSearchQuery,
  useGetByIdQuery,
  useCreate,
  usePatch,
  useDelete,
  useSetAttribute,
  useDeleteAttribute,
  useFetchSearchQuery
} from './default.query-service';
import { minutes, toSelectOptions } from '@util/helpers';

const model = 'initiatives';
const defaultBody = { sort: 'created_at', pageSize: 50, has_archived_at: false };

/** @type {useSearchQuery<InitiativeSearchRequest, Initiative>} */
export const useInitiatives = useSearchQuery({
  model,
  defaultBody,
  defaultQueryOptions: {
    staleTime: minutes(5)
  }
});

export const useFetchInitiatives = useFetchSearchQuery({ model, defaultBody });

/** @type {useSearchQuery<InitiativeSearchRequest, Initiative>} */
export const useInitiativeOptions = useSearchQuery({
  model,
  defaultBody,
  defaultQueryOptions: {
    select: toSelectOptions('id', 'title'),
    refetchOnMount: false
  }
});

/** @type {useGetByIdQuery<Initiative>} */
export const useInitiativeById = useGetByIdQuery({ model });

/** @type {useCreate<Initiative>} */
export const useCreateInitiative = useCreate({
  model,
  defaultBody: {
    start_at: new Date(),
    end_at: addYears(new Date(), 10),
    insight_config: {
      max_cards: 20,
      duration_days: 30
    }
  }
});

/** @type {useDelete<Initiative>} */
export const useDeleteInitiative = useDelete({ model });

/** @type {usePatch<Initiative>} */
export const usePatchInitiative = usePatch({ model });

export const useArchiveInitiative = useSetAttribute({ model, attribute: 'archived' });
export const useFollowInitiative = useSetAttribute({ model, attribute: 'follow' });
export const useUnfollowInitiative = useDeleteAttribute({ model, attribute: 'follow' });

/** @type{useCreate<{ formatting_instructions: string }, { explanatory_prompt: string, match_prompt: string }>} */
export const useGenerateLensPrompts = useCreate({
  model: `${model}/prompts`
});

export const generateLensPrompts = async (data) => {
  return Axios({
    method: 'POST',
    url: `${model}/prompts`,
    data
  });
};

/** @type{useCreate<{ formatting_instructions: string }, { value: string }>} */
export const useGenerateCardTemplate = useCreate({
  model: `${model}/cardTemplate`
});

/** @type{useCreate<{ formatting_instructions: string, title: string }, { value: string }>} */
export const useGenerateImprovedFormattingInstructions = useCreate({
  model: `${model}/meeting/summarization`
});

export const generateCardTemplate = async (formattingInstructions) => {
  return Axios({
    url: `/${model}/cardTemplate`,
    method: 'POST',
    data: { formatting_instructions: formattingInstructions }
  }).then((res) => res.data);
};

export const getLensPromptSuggestion = async (lensConfig) => {
  return Axios({
    url: `/${model}/lens/verify`,
    method: 'POST',
    data: lensConfig
  }).then((res) => res.data);
};

export const createInitiativeSkippingBackfill = async (initiative) => {
  return Axios({
    url: `/${model}`,
    method: 'POST',
    params: {
      skip: true
    },
    data: initiative
  })
    .then((res) => res.data)
    .catch((e) => {
      throw e;
    });
};

export const getFormattingInstructionsSuggestion = async (initiative) => {
  return Axios({
    url: `/${model}/formatting/verify`,
    method: 'POST',
    data: initiative
  }).then((res) => res.data);
};
