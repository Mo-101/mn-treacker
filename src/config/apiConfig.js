export const API_CONFIG = {
  RAT_LOCATIONS_API: '/api/rat-locations',
  LASSA_CASES_API: '/api/cases',
  WEATHER_API: '/api/openweather',
  TRAINING_API: '/api/training-progress'
};

export const API_KEYS = {
  OPENWEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY,
  MAPBOX: import.meta.env.VITE_MAPBOX_TOKEN,
  AERIS: {
    ID: import.meta.env.VITE_XWEATHER_ID,
    SECRET: import.meta.env.VITE_XWEATHER_SECRET
  }
};

export const MOCK_DATA = {
  LASSA_CASES: [
    {
      id: 1,
      latitude: 9.0820,
      longitude: 8.6753,
      severity: 'high',
      date: new Date().toISOString(),
      location: 'Nigeria'
    },
    {
      id: 2,
      latitude: 6.5244,
      longitude: 3.3792,
      severity: 'medium',
      date: new Date().toISOString(),
      location: 'Lagos'
    }
  ],
  DETECTIONS: [
    {
      id: 1,
      coordinates: [8.6753, 9.0820],
      species: 'Mastomys natalensis',
      confidence: 95,
      timestamp: new Date().toISOString(),
      details: 'Adult specimen detected',
      habitat: 'Urban environment',
      behavior: 'Foraging activity'
    }
  ]
};