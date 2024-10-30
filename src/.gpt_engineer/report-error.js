// Function to safely extract data from a Request object
const extractRequestData = (request) => {
  try {
    if (request instanceof Request) {
      // Only extract safe, serializable properties
      return {
        url: request.url,
        method: request.method,
        // Only include safe headers
        headers: Object.fromEntries([...request.headers].filter(([key]) => {
          const safeHeaders = ['content-type', 'accept', 'content-length'];
          return safeHeaders.includes(key.toLowerCase());
        }))
      };
    }
    // If it's a string URL
    if (typeof request === 'string') {
      return { url: request };
    }
    // For other types, return null
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
    // Create a basic serializable message
    const safeMessage = {
      type: 'error',
      timestamp: new Date().toISOString()
    };

    // Only add error info if it exists
    if (message.error) {
      safeMessage.error = extractErrorInfo(message.error);
    }

    // Only add request info if it exists and can be serialized
    if (message.request) {
      const safeRequest = extractRequestData(message.request);
      if (safeRequest) {
        safeMessage.request = safeRequest;
      }
    }

    // Test if message is cloneable before sending
    const cloneTest = structuredClone(safeMessage);
    
    // Send the message
    window.parent.postMessage(cloneTest, '*');
  } catch (err) {
    console.warn('Error in postMessage:', err);
    // Fallback to a simple error message
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

// Wrap fetch to handle errors
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  try {
    const response = await originalFetch.apply(this, args);
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.request = args[0];
      reportHTTPError(error);
      throw error;
    }
    return response;
  } catch (error) {
    if (args[0]) {
      error.request = args[0];
      reportHTTPError(error);
    }
    throw error;
  }
};

export { postMessage, reportHTTPError };