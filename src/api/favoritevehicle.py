from flask_sqlalchemy import SQLAlchemy
from .db import db
from api.vehicle import Vehicle

class FavoriteVehicle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "vehicle_id": self.vehicle_id,
            "vehicle_name": Vehicle.query.get(self.vehicle_id).serialize()["name"],
            "user_name": User.query.get(self.user_id).serialize()["name"],
            "user": User.query.get(self.user_id).serialize(),
            "vehicle": Vehicle.query.get(self.vehicle_id).serialize()
        }
