export const fetchWindData = async (timestamp) => {
  try {
    const response = await fetch(`/api/wind-data/${timestamp}`);
    if (!response.ok) throw new Error('Failed to fetch wind data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching wind data:', error);
    return null;
  }
};

export const loadWindImage = (windData, timestamp) => {
  return new Promise((resolve) => {
    const windImage = new Image();
    windData.image = windImage;
    windImage.src = `/wind/${timestamp}.png`;
    windImage.onload = () => resolve(windData);
  });
};