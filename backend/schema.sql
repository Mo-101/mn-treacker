-- Enable PostGIS extension for geographical data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Mastomys Natalensis Locations
CREATE TABLE mastomys_locations (
    id SERIAL PRIMARY KEY,
    geom GEOMETRY(Point, 4326),  -- PostGIS geometry column for location
    observation_date TIMESTAMP NOT NULL,
    population_size INTEGER,
    habitat_type VARCHAR(50),
    vegetation_density FLOAT,
    elevation FLOAT,
    temperature FLOAT,
    humidity FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lassa Fever Cases
CREATE TABLE lassa_fever_cases (
    id SERIAL PRIMARY KEY,
    geom GEOMETRY(Point, 4326),
    report_date TIMESTAMP NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high')),
    patient_age INTEGER,
    patient_gender VARCHAR(10),
    outcome VARCHAR(20),
    hospitalization_required BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Environmental Data
CREATE TABLE environmental_data (
    id SERIAL PRIMARY KEY,
    geom GEOMETRY(Point, 4326),
    observation_date TIMESTAMP NOT NULL,
    temperature FLOAT,
    humidity FLOAT,
    precipitation FLOAT,
    wind_speed FLOAT,
    wind_direction FLOAT,
    cloud_cover FLOAT,
    vegetation_index FLOAT,
    soil_moisture FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training Data
CREATE TABLE model_training (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    training_start TIMESTAMP,
    training_end TIMESTAMP,
    epochs_completed INTEGER,
    current_accuracy FLOAT,
    current_loss FLOAT,
    hyperparameters JSONB,
    status VARCHAR(20) CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Historical Weather Data
CREATE TABLE historical_weather (
    id SERIAL PRIMARY KEY,
    geom GEOMETRY(Point, 4326),
    observation_date TIMESTAMP NOT NULL,
    temperature FLOAT,
    precipitation FLOAT,
    humidity FLOAT,
    wind_speed FLOAT,
    pressure FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Administrative Boundaries
CREATE TABLE admin_boundaries (
    id SERIAL PRIMARY KEY,
    geom GEOMETRY(MultiPolygon, 4326),
    name VARCHAR(100) NOT NULL,
    level INTEGER CHECK (level IN (0, 1, 2)),  -- 0: country, 1: state/province, 2: district
    parent_id INTEGER REFERENCES admin_boundaries(id),
    properties JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial indexes
CREATE INDEX idx_mastomys_locations_geom ON mastomys_locations USING GIST(geom);
CREATE INDEX idx_lassa_cases_geom ON lassa_fever_cases USING GIST(geom);
CREATE INDEX idx_environmental_data_geom ON environmental_data USING GIST(geom);
CREATE INDEX idx_historical_weather_geom ON historical_weather USING GIST(geom);
CREATE INDEX idx_admin_boundaries_geom ON admin_boundaries USING GIST(geom);

-- Create temporal indexes
CREATE INDEX idx_mastomys_locations_date ON mastomys_locations(observation_date);
CREATE INDEX idx_lassa_cases_date ON lassa_fever_cases(report_date);
CREATE INDEX idx_environmental_data_date ON environmental_data(observation_date);
CREATE INDEX idx_historical_weather_date ON historical_weather(observation_date);

-- Add trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mastomys_locations_updated_at
    BEFORE UPDATE ON mastomys_locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_model_training_updated_at
    BEFORE UPDATE ON model_training
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create views for common queries
CREATE VIEW recent_cases_view AS
SELECT 
    lfc.*,
    ml.population_size as nearby_mastomys_population,
    ed.temperature,
    ed.humidity,
    ed.precipitation
FROM lassa_fever_cases lfc
LEFT JOIN mastomys_locations ml ON ST_DWithin(lfc.geom, ml.geom, 0.1)
LEFT JOIN environmental_data ed ON ST_DWithin(lfc.geom, ed.geom, 0.1)
WHERE lfc.report_date >= NOW() - INTERVAL '30 days';

CREATE VIEW environmental_risk_zones AS
SELECT 
    ed.geom,
    ed.temperature,
    ed.humidity,
    ed.precipitation,
    ml.population_size,
    COUNT(lfc.id) as nearby_cases
FROM environmental_data ed
LEFT JOIN mastomys_locations ml ON ST_DWithin(ed.geom, ml.geom, 0.1)
LEFT JOIN lassa_fever_cases lfc ON ST_DWithin(ed.geom, lfc.geom, 0.1)
GROUP BY ed.id, ml.id;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO mobase_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO mobase_user;