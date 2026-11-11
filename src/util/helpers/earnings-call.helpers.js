/**
 * Takes the `earningsCall` object from a bot and returns a string to be used as a meeting title
 * @param {*} earningsCallData
 */
export function earningsCallTitle(earningsCallData) {
  return `${earningsCallData.company_name} (${earningsCallData.symbol}) Q${earningsCallData.quarter} ${earningsCallData.year} Earnings Call`;
}
