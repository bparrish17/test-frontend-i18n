import Axios from 'axios';
import {
  getById,
  search,
  useGetByIdQuery,
  useSearchQuery,
  useSetAttribute
} from './default.query-service';

const model = 'conversations';
const defaultBody = { sort: 'created_at', asc: false };

export const searchConversations = async (body) => {
  return search({ model, body });
};

export const createConversation = async (data) => {
  return Axios({
    method: 'POST',
    url: `${model}`,
    data
  }).then((res) => res.data);
};

export const getConversationById = async (id) => getById({ model, id });

export const useConversations = useSearchQuery({ model, defaultBody });

export const useConversationById = useGetByIdQuery({ model });

export const setConversationArchived = async (conversationId, value) => {
  return Axios({
    method: 'PUT',
    url: `${model}/${conversationId}/archived?value=${value}`
  }).then((res) => res.data);
};
export const useSetConversationArchived = useSetAttribute({ model, attribute: 'archived' });
