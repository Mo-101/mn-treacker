export const mockRatLocations = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [27.12657, 3.46732]
      },
      properties: {
        id: 1,
        confidence: 0.85,
        timestamp: new Date().toISOString(),
        species: 'Mastomys natalensis'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [28.12657, 4.46732]
      },
      properties: {
        id: 2,
        confidence: 0.92,
        timestamp: new Date().toISOString(),
        species: 'Mastomys natalensis'
      }
    }
  ]
};

export const mockLassaCases = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [27.52657, 3.86732]
      },
      properties: {
        id: 1,
        severity: 'high',
        reportDate: new Date().toISOString()
      }
    }
  ]
};