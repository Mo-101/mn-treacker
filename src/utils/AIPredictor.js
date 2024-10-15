// This is a simplified AI prediction model. In a real-world scenario, 
// this would be a more complex machine learning model.

export const predictHabitatSuitability = (weatherData, mastomysData) => {
  const predictions = [];

  const areas = ['Forest', 'Grassland', 'Urban', 'Wetland'];

  areas.forEach(area => {
    let suitability = 0;

    // Basic logic for habitat suitability prediction
    if (weatherData.temperature > 20 && weatherData.temperature < 30) {
      suitability += 30;
    }

    if (weatherData.humidity > 60) {
      suitability += 20;
    }

    if (weatherData.cloudCover < 50) {
      suitability += 10;
    }

    // Adjust suitability based on Mastomys data
    const areaPopulation = mastomysData.filter(data => data.habitat === area).length;
    suitability += areaPopulation * 5;

    // Normalize suitability to be between 0 and 100
    suitability = Math.min(Math.max(suitability, 0), 100);

    predictions.push({ area, suitability });
  });

  // Sort predictions by suitability in descending order
  return predictions.sort((a, b) => b.suitability - a.suitability);
};