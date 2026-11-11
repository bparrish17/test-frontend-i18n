import { useCreate } from './default.query-service';

const model = 'feedback';

/** @type {useCreate<Feedback>} */
export const useCreateFeedback = useCreate({ model });
