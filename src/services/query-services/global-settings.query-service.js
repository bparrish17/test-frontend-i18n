import { useFindQuery } from '@services/query-services/default.query-service';

const model = 'global/settings';

export const useGlobalSettings = useFindQuery({ model });
