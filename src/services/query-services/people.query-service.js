import Axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  search,
  useGetByAttributeQuery,
  useCreate,
  useGetByIdQuery,
  usePatch,
  useSetAttribute
} from './default.query-service';
import { useUserStore } from '@store/app.store';
import { filterForaEmailsInOtherTenants } from '@util/helpers';

const model = 'people';

function changePassword({ value, newValue, confirmValue }) {
  return Axios({
    method: 'PUT',
    url: `/${model}/password`,
    data: { value, newValue, confirmValue }
  });
}

// todo: remove this in favor of usePatch
function updatePrompt({ personId, newPrompt }) {
  return Axios({
    method: 'PATCH',
    url: `/${model}/${personId}`,
    data: { id: personId, context: newPrompt }
  });
}

export function authenticate(email, password) {
  return Axios({
    method: 'POST',
    url: `${model}/authenticate`,
    data: {
      email,
      password,
      rememberMe: true
    }
  }).then((res) => res?.data);
}

export function deleteSession(sessionId) {
  return Axios({
    method: 'DELETE',
    url: `sessions/${sessionId}`
  }).then((res) => res?.data);
}

// todo: can use `useSearchQuery` with just useUserStore.getState() in the defaultBody?
const usePeopleQuery =
  (_defaultQueryOptions = {}) =>
  (body = {}, _queryOptions = {}) => {
    const queryOptions = { ..._defaultQueryOptions, ..._queryOptions };
    const tenantId = useUserStore((state) => state.tenant?.id);
    const defaultBody = { tenant_ids: [tenantId], pageSize: 1000 };

    // Extract includeTotal from queryOptions with a default value of true
    const includeTotal = queryOptions.includeTotal ? queryOptions.includeTotal : false;
    const queryKey = body ? [model, body, includeTotal] : [model, includeTotal];
    return useQuery({
      queryKey,
      queryFn: () => search({ model, body: { ...defaultBody, ...body }, includeTotal }),
      enabled: !!tenantId,
      ...queryOptions
    });
  };

export const useCreatePerson = useCreate({ model });

/** @type {useGetByIdQuery<Person>} */
export const usePersonById = useGetByIdQuery({ model });

/** @type {useGetByAttributeQuery<OrgPerson>} */
export const useOrgPersonById = useGetByAttributeQuery({ model, attribute: 'all' });

/** @type {usePatch<Person>} */
export const usePatchPerson = usePatch({ model });

/** @type {useSearchQuery<PersonSearchRequest, Person>} */
export const usePeople = usePeopleQuery();

/** @type {useSearchQuery<PersonSearchRequest, Person>} */
export const usePeopleOptions = usePeopleQuery({
  select: (people) =>
    filterForaEmailsInOtherTenants(people).map((person) => ({
      value: person.id,
      label: `${person.name} <${person.email}>`
    }))
});

export const useSetManager = useSetAttribute({ model, attribute: 'manager' });
export const useSetMeetingConfig = useSetAttribute({ model, attribute: 'meeting' });

export const useChangePassword = () =>
  useMutation({
    mutationFn: ({ value, newValue, confirmValue }) =>
      changePassword({ value, newValue, confirmValue })
  });
export const useUpdatePrompt = () =>
  useMutation({
    mutationFn: ({ personId, newPrompt }) => updatePrompt({ personId, newPrompt })
  });
