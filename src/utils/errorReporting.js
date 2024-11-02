const extractRequestInfo = (request) => {
  if (!request) return null;
  
  try {
    if (request instanceof Request) {
      // Only extract safe, serializable properties
      return {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(
          Array.from(request.headers.entries()).filter(([key]) => {
            const safeHeaders = ['content-type', 'accept', 'content-length'];
            return safeHeaders.includes(key.toLowerCase());
          })
        )
      };
    }
    return typeof request === 'string' ? request : null;
  } catch (err) {
    console.warn('Error extracting request info:', err);
    return null;
  }
};

export const reportError = (error, context = {}) => {
  try {
    const errorReport = {
      type: 'error',
      timestamp: new Date().toISOString(),
      message: error?.message || String(error),
      stack: error?.stack,
      errorType: error?.name || 'Error'
    };

    if (context.request) {
      const safeRequest = extractRequestInfo(context.request);
      if (safeRequest) {
        errorReport.request = safeRequest;
      }
    }

    // Use structured clone to ensure the object is cloneable
    const cloneableReport = JSON.parse(JSON.stringify(errorReport));
    window.parent.postMessage(cloneableReport, '*');
  } catch (err) {
    console.warn('Error reporting failed:', err);
  }
};