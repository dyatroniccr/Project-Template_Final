from flask_sqlalchemy import SQLAlchemy
from .db import db

class People(db.Model):
    id = db.Column(db.Integer, primary_key=True)    
    height = db.Column(db.String(20), unique=False, nullable=False)
    mass = db.Column(db.String(20), unique=False, nullable=False)    
    hair_color = db.Column(db.String(20), unique=False, nullable=False)
    skin_color = db.Column(db.String(20), unique=False, nullable=False)
    eye_color = db.Column(db.String(20), unique=False, nullable=False)
    birth_year = db.Column(db.String(30), unique=False, nullable=False)
    gender = db.Column(db.String(20), unique=False, nullable=False)     
    name = db.Column(db.String(250),  unique=False, nullable=False)
    homeworld = db.Column(db.String(250), unique=False, nullable=False)
    url = db.Column(db.String(250), unique=False, nullable=False)
    favorite_people = db.relationship('FavoritePeople', backref = 'people', lazy=True)

    def __repr__(self):
        return '<People %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,            
            "height": self.height,
            "mass": self.mass,
            "hair_color": self.hair_color,
            "skin_color": self.skin_color,            
            "eye_color": self.eye_color,
            "birth_year": self.birth_year,
            "gender": self.gender,
            "name": self.name,
            "homeworld": self.homeworld,
            "url": self.url           
        }