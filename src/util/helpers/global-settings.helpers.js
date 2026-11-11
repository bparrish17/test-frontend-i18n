// return true from this function to show outageMessage
export const evaluateOutageMessageVisibility = (outageMessageVisibility, globalSettings) => {
  if (!outageMessageVisibility) return true;
  let parsed;
  try {
    parsed = JSON.parse(outageMessageVisibility);
  } catch (e) {
    parsed = { outageMessageVisibility };
  }

  const { outageMessageVisibility: osv } = parsed;
  if (!osv) return true;
  if (globalSettings?.outage_message !== osv?.lastMessage) {
    return true;
  }
  return !osv.hidden;
};
