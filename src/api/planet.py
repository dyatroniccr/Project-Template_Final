from flask_sqlalchemy import SQLAlchemy
from .db import db

class Planet(db.Model):
    id = db.Column(db.Integer, primary_key=True)    
    diameter = db.Column(db.String(50), unique=False, nullable=False)
    rotation_period = db.Column(db.String(50), unique=False, nullable=False)
    orbital_period = db.Column(db.String(50), unique=False, nullable=False)
    gravity = db.Column(db.String(50), unique=False, nullable=False)
    population = db.Column(db.String(100), unique=False, nullable=False)
    climate = db.Column(db.String(100), unique=False, nullable=False)
    terrain = db.Column(db.String(100), unique=False, nullable=False)
    surface_water = db.Column(db.String(50), unique=False, nullable=False)
    name = db.Column(db.String(250), unique=True, nullable=False)
    url = db.Column(db.String(250), unique=False, nullable=False)
    favorite_planet = db.relationship('FavoritePlanet', backref = 'planet', lazy=True)

    def __repr__(self):
        return '<Planet %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,           
            "diameter": self.diameter,
            "rotation_period": self.rotation_period,
            "orbital_period": self.orbital_period,
            "gravity": self.gravity,
            "population": self.population,
            "climate": self.climate,
            "terrain": self.terrain,
            "surface_water": self.surface_water,
            "name": self.name,
            "url": self.url
        }