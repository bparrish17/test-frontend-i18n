export const checkForExpectedError = (errRes, expectedErrors) => {
  const errors = errRes?.response?.data?.errors ?? [];
  const expectedMsgSet = new Set(expectedErrors);
  const expectedErr = errors.find((responseError) => expectedMsgSet.has(responseError));
  return expectedErr || null;
};
