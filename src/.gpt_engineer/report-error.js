// Function to safely extract data from a Request object
const extractRequestData = (request) => {
  if (!request) return null;
  
  try {
    // If it's a Request object
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
    console.warn('Error extracting request data:', err);
    return null;
  }
};

// Safe postMessage function
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
      const safeRequest = extractRequestData(message.request);
      if (safeRequest) {
        safeMessage.request = safeRequest;
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

// Function to report HTTP errors
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

// Wrap fetch to handle errors without cloning the Request object
const safeFetch = async (...args) => {
  try {
    const response = await fetch(...args);
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      // Extract safe request data before reporting
      const requestData = extractRequestData(args[0]);
      reportHTTPError({
        message: error.message,
        request: requestData
      });
      throw error;
    }
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Replace global fetch with our safe version
window.fetch = safeFetch;

export { postMessage, reportHTTPError };