// Function to safely extract data from a Request object
const extractRequestData = (request) => {
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
  return String(request);
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
      timestamp: new Date().toISOString(),
      ...(message.error && { error: extractErrorInfo(message.error) }),
      ...(message.request && { request: extractRequestData(message.request) })
    };
    
    window.parent.postMessage(safeMessage, '*');
  } catch (err) {
    console.warn('Error in postMessage:', err);
  }
};

// Function to report HTTP errors
const reportHTTPError = (error) => {
  const errorDetails = {
    type: 'http_error',
    error: extractErrorInfo(error),
    timestamp: new Date().toISOString()
  };
  
  if (error.request) {
    errorDetails.request = extractRequestData(error.request);
  }
  
  postMessage(errorDetails);
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
    if (args[0] instanceof Request || typeof args[0] === 'string') {
      error.request = args[0];
      reportHTTPError(error);
    }
    throw error;
  }
};

export { postMessage, reportHTTPError };