import { supabase } from './supabase';

export const fetchRatLocations = async () => {
  const { data, error } = await supabase
    .from('rat_locations')
    .select('*');
  
  if (error) throw error;
  
  // Transform to match existing GeoJSON structure
  return {
    type: 'FeatureCollection',
    features: data.map(location => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      },
      properties: {
        id: location.id,
        locality: location.locality_community,
        country: location.country_country,
        state: location.state_province
      }
    }))
  };
};

export const fetchLassaFeverCases = async () => {
  const { data, error } = await supabase
    .from('lf_data')
    .select('*');
  
  if (error) throw error;
  
  // Transform to match existing GeoJSON structure
  return {
    type: 'FeatureCollection',
    features: data.map(location => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      },
      properties: {
        id: location.id,
        street: location.street,
        ward: location.address_ward,
        lga: location.address_lga,
        state: location.address_state,
        city: location.city
      }
    }))
  };
};

export const fetchWeatherData = async (lat, lon, layer = 'weather') => {
  const response = await fetch(`/api/openweather?lat=${lat}&lon=${lon}&layer=${layer}`);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  return response.json();
};

export const insertRatLocation = async (locationData) => {
  const { data, error } = await supabase
    .from('rat_locations')
    .insert([{
      locality_community: locationData.locality,
      country_country: locationData.country,
      state_province: locationData.state,
      latitude: locationData.latitude,
      longitude: locationData.longitude
    }]);
  
  if (error) throw error;
  return data;
};

export const updateLocationData = async (id, locationData) => {
  const { data, error } = await supabase
    .from('lf_data')
    .update({
      street: locationData.street,
      address_ward: locationData.ward,
      address_lga: locationData.lga,
      address_state: locationData.state,
      city: locationData.city,
      longitude: locationData.longitude,
      latitude: locationData.latitude
    })
    .eq('id', id);
  
  if (error) throw error;
  return data;
};