import { supabase } from './supabase';

export const fetchRatLocations = async () => {
  const { data, error } = await supabase
    .from('rat_locations')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const fetchLocationData = async () => {
  const { data, error } = await supabase
    .from('lf_data')
    .select('*');
  
  if (error) throw error;
  return data;
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