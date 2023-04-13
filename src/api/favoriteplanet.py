from flask_sqlalchemy import SQLAlchemy
#from .db import db
from .models import db, User
from .planet import Planet

class FavoritePlanet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    planet_id = db.Column(db.Integer, db.ForeignKey('planet.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "planet_id": self.planet_id,
            "planet_name": Planet.query.get(self.planet_id).serialize()["name"],
            "user_name": User.query.get(self.user_id).serialize()["name"],
            "user": User.query.get(self.user_id).serialize(),
            "planet": Planet.query.get(self.planet_id).serialize()
        }