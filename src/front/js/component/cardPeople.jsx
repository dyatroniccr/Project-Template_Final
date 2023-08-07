import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useParams } from "react-router-dom";

const CardPeople = (props) => {
  const { store, actions } = useContext(Context);

  return (
    <div className="card m-2" style={{ minWidth: "18rem" }}>
      <div className="card-body m-1 p-1">
        <img
          className="rounded img-thumbnail img-center"
          src={ "https://starwars-visualguide.com/assets/img/characters/" + props.uid + ".jpg" }
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://starwars-visualguide.com/assets/img/big-placeholder.jpg' }}
          alt="..."
        />
        <h4 className="card-title mt-2 text-center">{props.name}</h4>
        <p className="card-text text-start ps-4 mb-2">          
          <ul key={props.uid} className="text-start ps-4">
            <div>Gender: {props.gender}</div>
            <div>Height: {props.height}</div>
            <div>Mass: {props.mass}</div>
          </ul>
        </p>
        <div className="text-center">
          <Link
            to={`/people/${props.uid}`}
            className="btn btn-outline-primary me-5"
          >
            Learn More!
          </Link>
          <button
            type="button"
            onClick={() => {
              actions.agregarFavorito({
                name: props.name,
                uid: props.uid,
                category: "people",
                link: `/people/${props.uid}`,
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

export default CardPeople;
