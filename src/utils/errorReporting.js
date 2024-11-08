const sanitizeError = (error) => {
  return {
    message: error?.message || String(error),
    stack: error?.stack,
    type: error?.name || 'Error',
    timestamp: new Date().toISOString()
  };
};

const sanitizeRequest = (request) => {
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
    console.warn('Error sanitizing request:', err);
    return null;
  }
};

export const reportError = (error, request = null) => {
  try {
    const errorData = {
      type: 'error',
      ...sanitizeError(error)
    };

    if (request) {
      const safeRequest = sanitizeRequest(request);
      if (safeRequest) {
        errorData.request = safeRequest;
      }
    }

    window.parent.postMessage(errorData, '*');
  } catch (err) {
    console.warn('Error in error reporting:', err);
  }
};

export const reportHTTPError = (error) => {
  try {
    const errorDetails = sanitizeError(error);
    window.parent.postMessage(errorDetails, '*');
  } catch (err) {
    console.warn('Error reporting HTTP error:', err);
  }
};