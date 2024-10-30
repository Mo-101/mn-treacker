// Function to safely extract data from a Request object
const extractRequestData = (request) => {
  if (!request) return null;
  
  try {
    // If it's a Request object
    if (request instanceof Request) {
      return {
        url: request.url,
        method: request.method,
        // Convert headers to a plain object, only including safe headers
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
    console.warn('Error extracting request data:', err);
    return null;
  }
};

// Function to extract safe error information
const extractErrorInfo = (error) => ({
  message: error?.message || String(error),
  stack: error?.stack,
  type: error?.name || 'Error',
  timestamp: new Date().toISOString()
});

// Safe postMessage function
const postMessage = (message) => {
  try {
    const safeMessage = {
      type: 'error',
      timestamp: new Date().toISOString()
    };

    if (message.error) {
      safeMessage.error = extractErrorInfo(message.error);
    }

    if (message.request) {
      const safeRequest = extractRequestData(message.request);
      if (safeRequest) {
        safeMessage.request = safeRequest;
      }
    }

    // Use JSON to ensure message is serializable
    const serializedMessage = JSON.parse(JSON.stringify(safeMessage));
    window.parent.postMessage(serializedMessage, '*');
  } catch (err) {
    console.warn('Error in postMessage:', err);
    // Fallback to simple error message
    window.parent.postMessage({
      type: 'error',
      error: {
        message: 'Failed to send error report',
        timestamp: new Date().toISOString()
      }
    }, '*');
  }
};

// Function to report HTTP errors
const reportHTTPError = (error) => {
  try {
    const errorDetails = {
      type: 'http_error',
      error: extractErrorInfo(error)
    };

    if (error.request) {
      const safeRequest = extractRequestData(error.request);
      if (safeRequest) {
        errorDetails.request = safeRequest;
      }
    }

    postMessage(errorDetails);
  } catch (err) {
    console.warn('Error reporting HTTP error:', err);
  }
};

export { postMessage, reportHTTPError };