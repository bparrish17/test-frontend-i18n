import { useMutation } from '@tanstack/react-query';
import Axios from 'axios';
import { useGetByIdQuery } from './default.query-service';

const model = 'tenants';

export async function patchTenantAsAppUser({ model, body }) {
  return Axios({
    method: 'PATCH',
    url: `${model}`,
    data: body,
    params: {
      wait: true // waits for full ES indexing before completion
    }
  }).then((res) => res?.data);
}

/** @type {useGetByIdQuery<Tenant>} */
export const useTenantById = useGetByIdQuery({ model });

/** @type {usePatch<Tenant>} */
export const usePatchTenantAsAppUser = (mutateOptions = {}) =>
  useMutation({
    mutationFn: ({ id, ...body }) => patchTenantAsAppUser({ model, id, body }),
    ...mutateOptions
  });
