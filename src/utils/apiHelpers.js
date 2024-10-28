export const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    if (typeof window.reportHTTPError === 'function') {
      window.reportHTTPError({
        message: error.message,
        status: error.status,
        url: url
      });
    }
    throw error;
  }
};