const extractRequestData = (request) => {
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
    return typeof request === 'string' ? { url: request } : null;
  } catch (err) {
    console.warn('Error extracting request data:', err);
    return null;
  }
};

export const reportError = (error, request = null) => {
  try {
    const errorData = {
      type: 'error',
      timestamp: new Date().toISOString(),
      error: {
        message: error?.message || String(error),
        stack: error?.stack,
        type: error?.name || 'Error'
      }
    };

    if (request) {
      const safeRequest = extractRequestData(request);
      if (safeRequest) {
        errorData.request = safeRequest;
      }
    }

    const cloneableError = JSON.parse(JSON.stringify(errorData));
    window.parent.postMessage(cloneableError, '*');
  } catch (err) {
    console.warn('Error in error reporting:', err);
  }
};

export const reportHTTPError = (error) => {
  try {
    const errorDetails = {
      type: 'http_error',
      error: {
        message: error?.message || String(error),
        stack: error?.stack,
        type: error?.name || 'Error',
        timestamp: new Date().toISOString()
      }
    };

    const cloneableError = JSON.parse(JSON.stringify(errorDetails));
    window.parent.postMessage(cloneableError, '*');
  } catch (err) {
    console.warn('Error reporting HTTP error:', err);
  }
};