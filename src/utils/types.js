/**
 * @typedef {Object} RemoteSensingAugmentation
 * @property {'image_augmentation'|'geospatial_enhancement'|'noise_filtering'|'temporal_analysis'|'mastomys_natalensis_detection'} augmentation_type
 * @property {Object} parameters
 */

/**
 * @typedef {Object} MastomysNatalensisDetection
 * @property {Object} location_coordinates
 * @property {string} image_data - Base64 encoded image data
 * @property {Object} environmental_data
 * @property {Object} habitat_suitability
 */

/**
 * @typedef {Object} PredictionResult
 * @property {boolean} prediction_success
 * @property {Array<{
 *   latitude: number,
 *   longitude: number,
 *   suitability_score: number,
 *   confidence: number
 * }>} predicted_locations
 */

export {};