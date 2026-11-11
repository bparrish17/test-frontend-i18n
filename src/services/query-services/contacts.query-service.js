import { useGetByIdQuery, useSearchQuery } from './default.query-service';

const model = 'contacts';

export const useContactById = useGetByIdQuery({ model });
export const useContacts = useSearchQuery({ model });
