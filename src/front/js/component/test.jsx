import os
from flask import Flask, request, jsonify, url_for
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from utils import APIException, generate_sitemap
from admin import setup_admin
from models import db, User, People, Planet, Vehicle, FavoritePeople, FavoritePlanet, FavoriteVehicle, TokenBlockedList
#from models import Person

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity, get_jwt
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from datetime import date, time, datetime, timezone, timedelta #restas de fechas(timedelta)

from flask_bcrypt import Bcrypt #librería para encriptaciones

app = Flask(__name__)
app.url_map.strict_slashes = False

#inicio de instancia de JWT
app.config["JWT_SECRET_KEY"] = os.getenv("FLASK_APP_KEY")  # Change this!
jwt = JWTManager(app)

bcrypt = Bcrypt(app) #inicio mi instancia de Bcrypt OJO

db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

MIGRATE = Migrate(app, db)
db.init_app(app)
CORS(app)
setup_admin(app)

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    return generate_sitemap(app)


def verificacionToken(identity):
     
    print("jti", identity)
    token = TokenBlockedList.query.filter_by(token - identity).first()

    if token is None:
        return False
    
    return True

@app.route('/user', methods=['GET'])
def handle_hello():
    users = User.query.all() #(devuelve el diccionario)
    users = list(map(lambda item: item.serialize(),users))
    print(users)
   # response_body = {
  #    "msg": "Hello, this is your GET /user response "
  #  }

#    return jsonify(response_body), 200
    return jsonify(users), 200

@app.route('/register', methods=['POST'])
def register_user():
    #recibir el body en json y almacenarlo en la variable body
    body = request.get_json() #requet.json() pero hay que importar request.json
    
    #ordenar cada uno de los campos recibidos
    email = body["email"]
    name = body["name"]
    password = body["password"]
    is_active = body["is_active"]
    
    #validaciones
    if body is None:
        raise APIException("You neeed to specify the request body as json object", status_code=400)
    
    #Antes de enviar la informacion a la base de datos debemos encryptar el password
    password_encrypted = bcrypt.generate_password_hash(password, 10).decode('utf-8')
    
    #Crea la clase User en la variable new_user para enviar a la base
    #de Datos
    new_user = User(email=email, name=name, password=password_encrypted, is_active=is_active)
    
    #comitear la sesion
    db.session.add(new_user) #agregamos el nuevo usuario a la base de datos
    db.session.commit() #agregamos los cambios en la base de datos

    return jsonify({"mensaje":"Usuario creado correctamente"}), 201

@app.route('/user/<int:id>', methods=['GET'])
def get_specific_user(id):
    user = User.query.get(id) 
    #users = list(map(lambda item: item.serialize(),users))   
    return jsonify(user.serialize()), 200

@app.route('/get-user', methods=['POST'])
def get_specific_user2():
    body = request.get_json()
    id = body["id"]

    user = User.query.get(id) 

    #users = list(map(lambda item: item.serialize(),users))
    print(user)
    return jsonify(user.serialize()), 200


@app.route('/get-user', methods=['DELETE'])
def delete_specific_user():
    body = request.get_json()   
    id = body["id"]

    user = User.query.get(id) 

    db.session.delete(user)
    db.session.commit()  
  
    return jsonify("Usuario borrado"), 200


@app.route('/get-user', methods=['PUT'])
def edit_user():
    body = request.get_json()   
    id = body["id"]
    name = body["name"]

    user = User.query.get(id)   
    user.name = name #modifique el nombre del usuario

    db.session.commit()
  
    return jsonify(user.serialize()), 200

@app.route('/add-favorite/people', methods=['POST'])
def add_favorite_people():
    body = request.get_json()
    user_id = body["user_id"]
    people_id = body["people_id"]

    character = People.query.get(people_id)
    if not character:
        raise APIException('Personaje no encontrado', status_code=404)
    
    user = User.query.get(user_id)
    if not user:
        raise APIException('Usuario no encontrado', status_code=404)
    
    fav_exit = FavoritePeople.query.filter_by(user_id = user.id, people_id = character.id).first() is not None

    if fav_exit:
        raise APIException('El usuario ya lo tiene agregado a favoritos', status_code=404)
    
    favorite_people = FavoritePeople(user_id=user.id, people_id=character.id)
    db.session.add(favorite_people)
    db.session.commit()

    return jsonify(favorite_people.serialize()), 200

@app.route('/add-favorite/planet', methods=['POST'])
def add_favorite_planet():
    body = request.get_json()
    user_id = body["user_id"]
    planet_id = body["planet_id"]

    planet = Planet.query.get(planet_id)
    if not planet:
        raise APIException('Planeta no encontrado', status_code=404)
    
    user = User.query.get(user_id)
    if not user:
        raise APIException('Usuario no encontrado', status_code=404)
    
    fav_exit = FavoritePlanet.query.filter_by(user_id = user.id, planet_id = planet.id).first() is not None

    if fav_exit:
        raise APIException('El usuario ya lo tiene agregado a favoritos', status_code=404)
    
    favorite_planet = FavoritePlanet(user_id=user.id, planet_id=planet.id)
    db.session.add(favorite_planet)
    db.session.commit()

    return jsonify(favorite_planet.serialize()), 200


@app.route('/add-favorite/vehicle', methods=['POST'])
def add_favorite_vehicle():
    body = request.get_json()        
    user_id = body["user_id"]
    vehicle_id = body["vehicle_id"]

    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle:
        raise APIException('Vehiculo no encontrado', status_code=404)
    
    user = User.query.get(user_id)
    if not user:
        raise APIException('Usuario no encontrado', status_code=404)
    
    fav_exit = FavoriteVehicle.query.filter_by(user_id = user.id, vehicle_id = vehicle.id).first() is not None

    if fav_exit:
        raise APIException('El usuario ya lo tiene agregado a favoritos', status_code=404)
    
    favorite_vehicle = FavoriteVehicle(user_id=user.id, vehicle_id = vehicle.id)
    db.session.add(favorite_vehicle)
    db.session.commit()

    return jsonify(favorite_vehicle.serialize()), 200

@app.route('/add-people', methods=['POST'])
def add_people():
    #recibir el body en json y almacenarlo en la variable body
    body = request.get_json() #requet.json() pero hay que importar request.json
    
    #ordenar cada uno de los campos recibidos
    height = body["height"]
    mass = body["mass"]
    hair_color = body["hair_color"]
    skin_color = body["skin_color"]            
    eye_color = body["eye_color"]
    birth_year = body["birth_year"]
    gender = body["gender"]
    name = body["name"]
    homeworld = body["homeworld"]
    url = body["url"]    
    
    #validaciones
    if body is None:
        raise APIException("You neeed to specify the request body as json object", status_code=400)
    
    new_people = People(height=height, mass=mass, hair_color=hair_color, skin_color=skin_color, eye_color=eye_color, birth_year=birth_year, gender=gender, name=name, homeworld=homeworld, url=url)
    
    #comitear la sesion
    db.session.add(new_people) #agregamos el nuevo personaje a la base de datos
    db.session.commit() #agregamos los cambios en la base de datos

    return jsonify({"mensaje":"Personaje creado correctamente"}), 201

@app.route('/get-people', methods=['POST'])
def get_specific_people():
    body = request.get_json()
    id = body["id"]

    people = People.query.get(id) 

    #users = list(map(lambda item: item.serialize(),users))
    print(people)
    return jsonify(people.serialize()), 200

@app.route('/edit-people', methods=['PUT'])
def edit_people():
    body = request.get_json()   
    id = body["id"]
    name = body["name"]

    planet = Planet.query.get(id)   
    planet.name = name 

    db.session.commit()
  
    return jsonify(planet.serialize()), 200

@app.route('/delete-people', methods=['DELETE'])
def delete_specific_people():
    body = request.get_json()   
    id = body["id"]

    people = People.query.get(id) 

    db.session.delete(people)
    db.session.commit()  
  
    return jsonify("Character borrado"), 200

@app.route('/add-planet', methods=['POST'])
def add_planet():
    body = request.get_json() 
    
    #ordenar cada uno de los campos recibidos
    diameter = body["diameter"]
    rotation_period = body["rotation_period"]
    orbital_period = body["orbital_period"]
    gravity = body["gravity"]
    population = body["population"]
    climate = body["climate"]
    terrain = body["terrain"]
    surface_water = body["surface_water"]
    name = body["name"]
    url = body["url"]
    
    #validaciones
    if body is None:
        raise APIException("You neeed to specify the request body as json object", status_code=400)
    
    new_planet = Planet(diameter=diameter, rotation_period=rotation_period, orbital_period=orbital_period, gravity=gravity, population=population, climate=climate, terrain=terrain, surface_water=surface_water, name=name, url=url)
    
    #comitear la sesion
    db.session.add(new_planet) #agregamos el nuevo usuario a la base de datos
    db.session.commit() #agregamos los cambios en la base de datos

    return jsonify({"mensaje":"Planeta creado correctamente"}), 201

@app.route('/get-planet', methods=['POST'])
def get_specific_planet():
    body = request.get_json()
    id = body["id"]

    planet = Planet.query.get(id) 

    print(planet)
    return jsonify(planet.serialize()), 200

@app.route('/edit-planet', methods=['PUT'])
def edit_planet():
    body = request.get_json()   
    id = body["id"]
    name = body["name"]

    planet = Planet.query.get(id)   
    planet.name = name 

    db.session.commit()
  
    return jsonify(planet.serialize()), 200


@app.route('/delete-planet', methods=['DELETE'])
def delete_specific_planet():
    body = request.get_json()   
    id = body["id"]

    planet = Planet.query.get(id) 

    db.session.delete(planet)
    db.session.commit()  
  
    return jsonify("Planeta borrado"), 200

@app.route('/add-vehicle', methods=['POST'])
def add_vehicle():
    body = request.get_json() 

    #ordenar cada uno de los campos recibidos
    model = body["model"]
    starship_class = body["starship_class"]
    manufacturer = body["manufacturer"]
    cost_in_credits = body["cost_in_credits"]
    length = body["length"]
    crew = body["crew"]
    passengers = body["passengers"]
    max_atmosphering_speed = body["max_atmosphering_speed"]
    hyperdrive_rating = body["hyperdrive_rating"]
    mglt = body["mglt"]
    cargo_capacity = body["cargo_capacity"]
    consumables = body["consumables"]
    pilots = body["pilots"]
    name = body["name"]
    url = body["url"]
    
    #validaciones
    if body is None:
        raise APIException("You neeed to specify the request body as json object", status_code=400)
    
    new_vehicle = Vehicle(model=model, starship_class=starship_class, manufacturer=manufacturer, cost_in_credits=cost_in_credits, length=length, crew=crew, passengers=passengers, max_atmosphering_speed=max_atmosphering_speed, hyperdrive_rating=hyperdrive_rating, mglt=mglt, cargo_capacity=cargo_capacity, consumables=consumables, pilots=pilots, name=name, url=url)
    
    #comitear la sesion
    db.session.add(new_vehicle) #agregamos el nuevo vehiculo a la base de datos
    db.session.commit() #agregamos los cambios en la base de datos

    return jsonify({"mensaje":"Vehicle creado correctamente"}), 201

@app.route('/get-vehicle', methods=['POST'])
def get_specific_vehicle():
    body = request.get_json()
    id = body["id"]

    vehicle = Vehicle.query.get(id) 

    print(vehicle)
    return jsonify(vehicle.serialize()), 200

@app.route('/edit-vehicle', methods=['PUT'])
def edit_vehicle():
    body = request.get_json()   
    id = body["id"]
    name = body["name"]

    vehicle = Vehicle.query.get(id)   
    vehicle.name = name 

    db.session.commit()
  
    return jsonify(vehicle.serialize()), 200

@app.route('/delete-vehicle', methods=['DELETE'])
def delete_specific_vehicle():
    body = request.get_json()   
    id = body["id"]

    vehicle = Vehicle.query.get(id) 

    db.session.delete(vehicle)
    db.session.commit()  
  
    return jsonify("Vehiculo borrado"), 200

@app.route('/favorites', methods=['POST'])
@jwt_required()   #Es una ruta protegida porque tengo el decorador
def list_favorites():
    body = request.get_json()
    #user_id = body["user_id"]
    user_id = get_jwt_identity()

    if not user_id:
        raise APIException('Faltan datos', status_code=404)

    user = User.query.get(user_id)
    if not user:
        raise APIException('User Not Found', status_code=404)
    
    user_favorites_people = FavoritePeople.query.filter_by(user_id=user_id).all()
    user_favorites_final_people = list(map(lambda item: item.serialize(), user_favorites_people))

    user_favorites_planets = FavoritePlanet.query.filter_by(user_id=user_id).all()
    user_favorites_final_planets = list(map(lambda item: item.serialize(), user_favorites_planets))

    user_favorites_vehiles = FavoriteVehicle.query.filter_by(user_id=user_id).all()
    user_favorites_final_vehicles = list(map(lambda item: item.serialize(), user_favorites_vehiles))

    user_favorites_final = user_favorites_final_people + user_favorites_final_planets + user_favorites_final_vehicles

    return jsonify( {
        "all_Favorites:" : user_favorites_final }), 200

@app.route('/login', methods=['POST'])
def login():
    email=request.get_json()["email"]
    password = request.get_json()["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"message":"Login failed"}), 401
    
    """if password != user.password:
        return jsonify({"message":"Login failed"}), 401"""

    #validar el password encriptado
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message":"Login failed"}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify({"token":access_token}), 200


#Colocamos el Decorador de Proteccion
@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    #jti = get_jwt()["jti"] #Identificador del JWT (es más corto) 
    #token = TokenBlockedList.query.filter_by(token-jti).first() #reuso la función de verificacion de token"""
    #token_P = verificacionToken(get_jwt()["jti"])
    #print(token)
    
    #if token:
    #   raise APIException('Token está en lista negra', status_code=404)

    print("EL usuario es: ", user.name)
    return jsonify({"message":"Estás en una ruta protegida", "name":user.name}), 200

@app.route("/logout", methods=["POST"])
#@app.route("/logout", methods=["GET"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"] #Identificador del JWT (es más corto) - Extrae un diccionario
    now = datetime.now(timezone.utc) 

    #identificamos al usuario
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    tokenBlocked = TokenBlockedList(token=jti , created_at=now, email=user.email)
    db.session.add(tokenBlocked)
    db.session.commit()

    return jsonify({"message":"logout successfully"})



# this only runs if `$ python src/app.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=PORT, debug=False)
