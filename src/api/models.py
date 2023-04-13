from flask_sqlalchemy import SQLAlchemy
from .db import db
from .favoritepeople import FavoritePeople
from .favoriteplanet import FavoritePlanet
from .favoritevehicle import FavoriteVehicle

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(250), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    name = db.Column(db.String(120), unique=False, nullable=False)
    favorite_people = db.relationship('FavoritePeople', backref = 'user', lazy=True)
    favorite_planet = db.relationship('FavoritePlanet', backref = 'user', lazy=True)
    favorite_vehicle = db.relationship('FavoriteVehicle', backref = 'user', lazy=True)

    def __repr__(self):
        return '<User %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name
            # do not serialize the password, its a security breach
        }