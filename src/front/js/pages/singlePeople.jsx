import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";

const SinglePeople = () => {
  const { store, actions } = useContext(Context);
  const params = useParams();
  const [people, setPeople] = useState({});

  useEffect(() => {
    const cargaDatos = async () => {
      let { respuestaJson, response } = await actions.useFetch(
        `/people/${params.uid}`
      );
      if (response.ok) {
        console.log(respuestaJson);
        setPeople(respuestaJson.result.properties);
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
                  "https://starwars-visualguide.com/assets/img/characters/" + params.uid +".jpg"
                }
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://starwars-visualguide.com/assets/img/big-placeholder.jpg";
                }}
                alt="Character Image"
              />
            </div>
            <div className="col-md-6">
              <h1 className="singleCardTitle">
                {people.name ? people.name : ""} | UID # {params.uid}
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
            <div className="col-md-2">
              <p className="text-danger">Name</p>
              <p className="text-danger">{people.name}</p>
            </div>
            <div className="col-md-2">
              <p className="text-danger">Birth Year</p>
              <p className="text-danger">{people.birth_year}</p>
            </div>
            <div className="col-md-2">
              <p className="text-danger">Gender</p>
              <p className="text-danger">{people.gender}</p>
            </div>
            <div className="col-md-2">
              <p className="text-danger">Height</p>
              <p className="text-danger">{people.height}</p>
            </div>
            <div className="col-md-2">
              <p className="text-danger">Skin Color</p>
              <p className="text-danger">{people.skin_color}</p>
            </div>
            <div className="col-md-2">
              <p className="text-danger">Eye Color</p>
              <p className="text-danger">{people.eye_color}</p>
            </div>
          </div>
        </div>
        <Link to="/">
          <button type="button" className="btn btn-primary mt-3">
            Go Back
          </button>
        </Link>
      </div>
    </>
  );
};

export default SinglePeople;
