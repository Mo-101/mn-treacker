// Function to safely extract data from a Request object
function extractRequestData(request) {
  try {
    if (request instanceof Request) {
      // Create a simple serializable object with basic request info
      return {
        url: request.url || 'unknown',
        method: request.method || 'unknown',
        // Convert headers to a simple object with only safe headers
        headers: Array.from(request.headers || [])
          .filter(([key]) => {
            const safeHeaders = ['content-type', 'accept', 'content-length'];
            return safeHeaders.includes(key.toLowerCase());
          })
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {})
      };
    }
    return String(request);
  } catch (err) {
    // Fallback if request cannot be processed
    return 'Unable to process request details';
  }
}

// Function to extract relevant error information
function extractErrorInfo(error) {
  try {
    return {
      message: error?.message || String(error),
      stack: error?.stack,
      type: error?.name || 'Error',
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    return {
      message: 'Error information could not be extracted',
      timestamp: new Date().toISOString()
    };
  }
}

// Safe postMessage function
function postMessage(message) {
  try {
    // Create a cloneable message object
    const safeMessage = {
      type: 'error',
      timestamp: new Date().toISOString()
    };
    
    // Safely handle error data
    if (message.error) {
      safeMessage.error = extractErrorInfo(message.error);
    }
    
    // Safely handle request data
    if (message.request) {
      safeMessage.request = extractRequestData(message.request);
    }
    
    // Post the sanitized message
    window.parent.postMessage(safeMessage, '*');
  } catch (error) {
    // Fallback error message
    window.parent.postMessage({
      type: 'error',
      error: {
        message: 'Failed to send error report',
        timestamp: new Date().toISOString()
      }
    }, '*');
  }
}

// Function to report HTTP errors
function reportHTTPError(error) {
  const errorDetails = {
    type: 'http_error',
    error: extractErrorInfo(error),
    timestamp: new Date().toISOString()
  };
  
  if (error.request) {
    errorDetails.request = extractRequestData(error.request);
  }
  
  postMessage(errorDetails);
}

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
    error.request = args[0];
    reportHTTPError(error);
    throw error;
  }
};

export { postMessage, reportHTTPError };