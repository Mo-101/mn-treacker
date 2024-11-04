export const calculatePathDensity = (coordinates, allPaths) => {
  let density = 0;
  const threshold = 0.001; // Approximately 100m at the equator

  allPaths.forEach(path => {
    path.coordinates.forEach(point => {
      const distance = calculateDistance(coordinates, point);
      if (distance < threshold) {
        density += 1;
      }
    });
  });

  return Math.min(density / 10, 1); // Normalize density between 0 and 1
};

export const calculateDistance = (point1, point2) => {
  const [lon1, lat1] = point1;
  const [lon2, lat2] = point2;
  return Math.sqrt(Math.pow(lon2 - lon1, 2) + Math.pow(lat2 - lat1, 2));
};

export const calculateDirection = (point1, point2) => {
  const [lon1, lat1] = point1;
  const [lon2, lat2] = point2;
  return (Math.atan2(lon2 - lon1, lat2 - lat1) * 180) / Math.PI;
};

export const processPathData = (rawData) => {
  return rawData.map(path => {
    const processedPath = {
      ...path,
      density: calculatePathDensity(path.coordinates[0], rawData),
      direction: calculateDirection(
        path.coordinates[0],
        path.coordinates[path.coordinates.length - 1]
      )
    };
    return processedPath;
  });
};