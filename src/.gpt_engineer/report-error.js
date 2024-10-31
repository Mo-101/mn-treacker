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
    if (typeof request === 'string') {
      return { url: request };
    }
    return null;
  } catch (err) {
    console.warn('Error extracting request data:', err);
    return null;
  }
};

const postMessage = (message) => {
  try {
    const safeMessage = {
      type: 'error',
      timestamp: new Date().toISOString()
    };

    if (message.error) {
      safeMessage.error = {
        message: message.error?.message || String(message.error),
        stack: message.error?.stack,
        type: message.error?.name || 'Error'
      };
    }

    if (message.request) {
      const requestData = extractRequestData(message.request);
      if (requestData) {
        safeMessage.request = JSON.parse(JSON.stringify(requestData));
      }
    }

    window.parent.postMessage(safeMessage, '*');
  } catch (err) {
    console.warn('Error in postMessage:', err);
    window.parent.postMessage({
      type: 'error',
      error: {
        message: 'Failed to send error report',
        timestamp: new Date().toISOString()
      }
    }, '*');
  }
};

const reportHTTPError = (error) => {
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

    postMessage(errorDetails);
  } catch (err) {
    console.warn('Error reporting HTTP error:', err);
  }
};

export { postMessage, reportHTTPError };