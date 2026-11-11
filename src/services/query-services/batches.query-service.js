import { useSearchQuery } from './default.query-service';

const model = 'batches';
const defaultBody = { sort: 'created_at', asc: false, pageSize: 50 };

/** @type {useSearchQuery<ChannelSearchRequest, Channel>} */
export const useBatches = useSearchQuery({ model, defaultBody });
