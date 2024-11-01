const extractRequestInfo = (request) => {
  if (!request) return null;
  
  try {
    if (request instanceof Request) {
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
    return String(request);
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
      errorReport.request = extractRequestInfo(context.request);
    }

    // Only send safe, cloneable data
    window.parent.postMessage(errorReport, '*');
  } catch (err) {
    console.warn('Error reporting failed:', err);
  }
};