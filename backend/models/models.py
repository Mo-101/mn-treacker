from geoalchemy2 import Geometry
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.sql import func
from .database import Base

class MastomysLocation(Base):
    __tablename__ = "mastomys_locations"
    
    id = Column(Integer, primary_key=True, index=True)
    geom = Column(Geometry('Point', srid=4326))
    observation_date = Column(DateTime, nullable=False)
    population_size = Column(Integer)
    habitat_type = Column(String)
    vegetation_density = Column(Float)
    elevation = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class LassaFeverCase(Base):
    __tablename__ = "lassa_fever_cases"
    
    id = Column(Integer, primary_key=True, index=True)
    geom = Column(Geometry('Point', srid=4326))
    report_date = Column(DateTime, nullable=False)
    severity = Column(String)
    patient_age = Column(Integer)
    patient_gender = Column(String)
    outcome = Column(String)
    hospitalization_required = Column(Boolean)
    created_at = Column(DateTime, server_default=func.now())

class EnvironmentalData(Base):
    __tablename__ = "environmental_data"
    
    id = Column(Integer, primary_key=True, index=True)
    geom = Column(Geometry('Point', srid=4326))
    observation_date = Column(DateTime, nullable=False)
    temperature = Column(Float)
    humidity = Column(Float)
    precipitation = Column(Float)
    wind_speed = Column(Float)
    wind_direction = Column(Float)
    cloud_cover = Column(Float)
    vegetation_index = Column(Float)
    soil_moisture = Column(Float)
    created_at = Column(DateTime, server_default=func.now())

class ModelTraining(Base):
    __tablename__ = "model_training"
    
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    training_start = Column(DateTime)
    training_end = Column(DateTime)
    epochs_completed = Column(Integer)
    current_accuracy = Column(Float)
    current_loss = Column(Float)
    hyperparameters = Column(JSON)
    status = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class HistoricalWeather(Base):
    __tablename__ = "historical_weather"
    
    id = Column(Integer, primary_key=True, index=True)
    geom = Column(Geometry('Point', srid=4326))
    observation_date = Column(DateTime, nullable=False)
    temperature = Column(Float)
    precipitation = Column(Float)
    humidity = Column(Float)
    wind_speed = Column(Float)
    pressure = Column(Float)
    created_at = Column(DateTime, server_default=func.now())

class AdminBoundary(Base):
    __tablename__ = "admin_boundaries"
    
    id = Column(Integer, primary_key=True, index=True)
    geom = Column(Geometry('MultiPolygon', srid=4326))
    name = Column(String, nullable=False)
    level = Column(Integer)
    parent_id = Column(Integer, ForeignKey('admin_boundaries.id'))
    properties = Column(JSON)
    created_at = Column(DateTime, server_default=func.now())