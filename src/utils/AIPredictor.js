import { getCachedWeatherData } from './WeatherDataCache';

export const predictHabitatSuitability = (weatherData, mastomysData) => {
  const predictions = [];
  const areas = ['Forest', 'Grassland', 'Urban', 'Wetland'];

  areas.forEach(area => {
    let suitability = 0;

    // Enhanced logic for habitat suitability prediction
    if (weatherData.temperature > 20 && weatherData.temperature < 30) {
      suitability += 30;
    } else if (weatherData.temperature > 30) {
      suitability -= 10;
    }

    if (weatherData.humidity > 60) {
      suitability += 20;
    } else if (weatherData.humidity < 30) {
      suitability -= 10;
    }

    if (weatherData.cloudCover < 50) {
      suitability += 10;
    }

    if (weatherData.precipitation > 0 && weatherData.precipitation < 10) {
      suitability += 15;
    } else if (weatherData.precipitation > 10) {
      suitability -= 5;
    }

    if (weatherData.windSpeed < 15) {
      suitability += 10;
    } else {
      suitability -= 5;
    }

    // Adjust suitability based on Mastomys data
    const areaPopulation = mastomysData.filter(data => data.habitat === area).length;
    suitability += areaPopulation * 5;

    // Normalize suitability to be between 0 and 100
    suitability = Math.min(Math.max(suitability, 0), 100);

    predictions.push({ area, suitability });
  });

  return predictions.sort((a, b) => b.suitability - a.suitability);
};

export const monitorPredictions = (weatherData, mastomysData, addNotification) => {
  const predictions = predictHabitatSuitability(weatherData, mastomysData);

  predictions.forEach((prediction) => {
    if (prediction.suitability >= 80) {
      addNotification({
        type: 'alert',
        message: `High-risk area detected in ${prediction.area} with suitability score of ${prediction.suitability}%`
      });
    }
  });

  return predictions;
};