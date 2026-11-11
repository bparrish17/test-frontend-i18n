export const maxFileSizeBytes = (maxSizeMB) => {
  return maxSizeMB * 1_000_000; // Convert MB to bytes
};

export const createFileValidator = ({ maxSizeMB = 300, customMessage }) => {
  const maxSize = maxFileSizeBytes(maxSizeMB);

  return (file, onError) => {
    let error = null;

    if (file.size > maxSize) {
      error = {
        message: customMessage || `File size exceeds the maximum limit (${maxSizeMB}MB)`,
        code: 'file-too-large'
      };
    }

    onError?.(error); // Optional chaining in case onError is undefined
    return error;
  };
};
