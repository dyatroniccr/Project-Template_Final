import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";

const SingleVehicles = () => {
  const { store, actions } = useContext(Context);
  const params = useParams();
  const [vehicle, setVehicle] = useState({});

  useEffect(() => {
    const cargaDatos = async () => {
      let { respuestaJson, response } = await actions.useFetch(
        `/vehicles/${params.uid}`
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
    <>
      <div className="jumbotron jumbotron-fluid bg-light border rounded w-75 mx-auto mt-5 p-3 text-center">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-6">
              <img
                className="img-fluid rounded"
                src={
                  "https://starwars-visualguide.com/assets/img/starships/"+params.uid+".jpg"
                }
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://starwars-visualguide.com/assets/img/big-placeholder.jpg";
                }}
                alt="Vehicle Image"
              />
            </div>
            <div className="col-md-6">
              <h1 className="singleCardTitle">
                {vehicle.name ? vehicle.name : ""} | UID # {params.uid}
              </h1>
              <p className="lead text-justify">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                ornare lacus nec magna suscipit dictum. Nullam sit amet viverra
                metus. Praesent facilisis dictum ipsum eu venenatis.
                Pellentesque imperdiet nunc non pulvinar viverra. Suspendisse
                sollicitudin egestas nisl at mattis. Nullam quis rutrum massa.
                Integer non turpis at felis facilisis viverra sit amet et mi.
                Mauris mattis magna turpis, nec consectetur erat congue quis.
                Phasellus eu nibh vitae arcu gravida maximus sagittis imperdiet
                massa. Aenean maximus eu velit ac tempus. Mauris at massa sed
                orci tempor auctor. Nunc auctor sapien non sem convallis cursus
                et quis lacus. Donec eleifend tellus vel lacinia consequat.
                Pellentesque ex felis, placerat non accumsan placerat, sagittis
                eget eros. Sed luctus turpis eu placerat pharetra. Pellentesque
                eleifend ac odio non ornare.
              </p>
            </div>
          </div>
          <hr className="my-4" />
          <div className="row justify-content-center align-items-center">
            <div className="col-md-3">
              <p className="text-danger">Model</p>
              <p className="text-danger">{vehicle.model}</p>
            </div>
            <div className="col-md-3">
              <p className="text-danger">Passengers</p>
              <p className="text-danger">{vehicle.passengers}</p>
            </div>
            <div className="col-md-3">
              <p className="text-danger">Length</p>
              <p className="text-danger">{vehicle.length}</p>
            </div>
            <div className="col-md-3">
              <p className="text-danger">Cargo Capacity</p>
              <p className="text-danger">{vehicle.cargo_capacity}</p>
            </div>
            <br />
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleVehicles;
