const extractRequestInfo = (request) => {
  if (!request) return null;
  
  try {
    if (request instanceof Request) {
      return {
        url: request.url,
        method: request.method,
        // Only include safe headers
        headers: Object.fromEntries(
          Array.from(request.headers.entries()).filter(([key]) => {
            const safeHeaders = ['content-type', 'accept', 'content-length'];
            return safeHeaders.includes(key.toLowerCase());
          })
        )
      };
    }
    // If it's a string URL
    if (typeof request === 'string') {
      return { url: request };
    }
    return null;
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

    // Only include safe, cloneable context data
    if (context.request) {
      const safeRequest = extractRequestInfo(context.request);
      if (safeRequest) {
        errorReport.request = safeRequest;
      }
    }

    // Ensure the data is cloneable before sending
    const safeReport = JSON.parse(JSON.stringify(errorReport));
    window.parent.postMessage(safeReport, '*');
  } catch (err) {
    console.warn('Error reporting failed:', err);
  }
};