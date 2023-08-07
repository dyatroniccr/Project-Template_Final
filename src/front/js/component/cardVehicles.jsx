import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useParams } from "react-router-dom";

const CardVehicles = () => {
  const { store, actions } = useContext(Context);
  const params = useParams();
  const [vehicle, setVehicle] = useState({});

  useEffect(() => {
    const cargaDatos = async () => {
      let { respuestaJson, response } = await actions.useFetch(
        `/starships/${params.uid}`
      );
      if (response.ok) {
        console.log(respuestaJson);
        setVehicle(respuestaJson.result.properties);
        console.log(vehicle.uid);
      }
    };
    cargaDatos();
  }, [params.uid]);

  return (
    <div className="card m-2" style={{ minWidth: "18rem" }}>
      <div className="card-body m-1 p-1">
        <img
          className="rounded img-thumbnail img-center"
          src={
            "https://starwars-visualguide.com/assets/img/starships/" +
            params.uid +
            ".jpg"
          }
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://starwars-visualguide.com/assets/img/big-placeholder.jpg";
          }}
          alt="..."
        />
        <br />
        <h3 className="card-title mt-2 text-center">{vehicle.name}</h3>
        <p className="card-text text-start ps-4 mb-2">
          <ul className="text-start ps-4">
            <div key={vehicle.uid}>Model: {vehicle.model}</div>
            <div key={vehicle.uid}>Manufacturer: {vehicle.manufacturer}</div>
          </ul>
        </p>
        <div className="text-center">
          <Link
            to={`/vehicles/${vehicle.uid}`}
            className="btn btn-outline-primary me-5"
          >
            Learn More!
          </Link>
          <button
            type="button"
            onClick={() => {
              actions.agregarFavorito({
                name: vehicle.name,
                uid: vehicle.uid,
                category: "vehicle",
                link: `/vehicle/${vehicle.uid}`,
              });
            }}
            className="btn btn-outline-warning ms-5"
          >
            <i className="far fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardVehicles;
