export const fetchEnvironmentalData = async (timeframe = 'weekly') => {
  try {
    const response = await fetch(`/api/environmental-data?timeframe=${timeframe}`);
    if (!response.ok) {
      throw new Error('Failed to fetch environmental data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching environmental data:', error);
    // Return null to trigger the fallback data in the component
    return null;
  }
};

export const fetchRatData = async (locationId) => {
  try {
    const response = await fetch(`/api/rat-locations${locationId ? `/${locationId}` : ''}`);
    if (!response.ok) {
      throw new Error('Failed to fetch rat data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching rat data:', error);
    // Return empty data structure to prevent UI errors
    return { trends: [] };
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await fetch('/api/cases');
    if (!response.ok) {
      throw new Error('Failed to fetch Lassa Fever cases');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Lassa Fever cases:', error);
    return [];
  }
};

export const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};