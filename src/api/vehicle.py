from flask_sqlalchemy import SQLAlchemy
from .db import db

class Vehicle(db.Model):
    id = db.Column(db.Integer, primary_key=True)    
    model = db.Column(db.String(100), unique=False, nullable=False)
    starship_class = db.Column(db.String(100), unique=False, nullable=False)
    manufacturer = db.Column(db.String(100), unique=False, nullable=False)
    cost_in_credits = db.Column(db.String(100), unique=False, nullable=False)
    length = db.Column(db.String(20), unique=False, nullable=False)
    crew = db.Column(db.String(20), unique=False, nullable=False)
    passengers = db.Column(db.String(20), unique=False, nullable=False)
    max_atmosphering_speed = db.Column(db.String(20), unique=False, nullable=False)
    hyperdrive_rating = db.Column(db.String(20), unique=False, nullable=False)
    mglt = db.Column(db.String(20), unique=False, nullable=False)
    cargo_capacity = db.Column(db.String(20), unique=False, nullable=False)
    consumables = db.Column(db.String(50), unique=False, nullable=False)
    pilots = db.Column(db.String(250), unique=False, nullable=False)
    name = db.Column(db.String(250), unique=True, nullable=False)
    url = db.Column(db.String(250), unique=False, nullable=False)
    favorite_vehicle = db.relationship('FavoriteVehicle', backref = 'vehicle', lazy=True)

    def __repr__(self):
        return '<Vehicle %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,                 
            "model": self.model,
            "starship_class": self.starship_class,
            "manufacturer": self.manufacturer,
            "cost_in_credits": self.cost_in_credits,
            "length": self.length,
            "crew": self.crew,
            "passengers": self.passengers,
            "max_atmosphering_speed": self.max_atmosphering_speed,
            "hyperdrive_rating": self.hyperdrive_rating,
            "mglt": self.mglt,
            "cargo_capacity": self.cargo_capacity,
            "consumables": self.consumables,
            "pilots": self.pilots,
            "name": self.name,
            "url": self.url            
        }