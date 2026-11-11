import Axios from 'axios';

function makeLambdaRequest({ method, functionId, data = {} }) {
  return Axios({
    method,
    url: `https://${functionId}.lambda-url.us-east-1.on.aws/`,
    data
  }).then((res) => res.data);
}

/**
 * @param {{
 *  tenant_id: string;
 *  slack_channel_ids: string[];
 *  start_at: number;
 *  end_at: number;
 * }} body
 * @returns {Promise<string>} - GPT-4 Generated Summary of Provided Slack Channels
 */
export function createManualSlackSummary(body) {
  return makeLambdaRequest({
    functionId: 'bzojyisfevdjo4kx4yb4kdbsom0kcfed',
    method: 'POST',
    data: body
  }).catch((err) => {
    throw new Error(err?.response?.data);
  });
}
