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
      errorType: error?.name || 'Error',
      context: { ...context }
    };

    if (context.request) {
      errorReport.request = extractRequestInfo(context.request);
    }

    // Only send safe, cloneable data
    window.parent.postMessage(JSON.parse(JSON.stringify(errorReport)), '*');
  } catch (err) {
    console.warn('Error reporting failed:', err);
  }
};