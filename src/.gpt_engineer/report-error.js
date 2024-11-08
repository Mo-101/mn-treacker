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
            const safeHeaders = ['content-type', 'accept'];
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

// Safe postMessage function that ensures data is cloneable
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

    window.parent.postMessage(JSON.parse(JSON.stringify(safeMessage)), '*');
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

export { postMessage };