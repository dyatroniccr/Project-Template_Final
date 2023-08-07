import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { store, actions } = useContext(Context);

  const handleDelete = (itemIndex) => {
    actions.deleteFavorite(itemIndex);
  };

  return (
    <nav className="navbar navbar-light bg-black">
      <div className="container">
        <Link to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Star_Wars_Logo.svg/2560px-Star_Wars_Logo.svg.png"
            style={{ width: "100px" }}
          ></img>
        </Link>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNavDarkDropdown"
        >
          <div className="nav-item dropdown btn btn-warning">
            <div
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Favorites
            </div>
            <ul
              className="dropdown-menu list-unstyled"
              aria-labelledby="navbarDropdown"
            >
              {store.favoritos && store.favoritos.length > 0 ? (
                <>
                  {store.favoritos.map((item, index) => {
                    return (
                      <>
                        <React.Fragment key={index}>
                          <Link to={item.link} className="text-left">
                            <li className="d-flex align-items-center">
                              {item.name}
                            </li>
                          </Link>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(index)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </React.Fragment>
                      </>
                    );
                  })}
                </>
              ) : (
                <>No favorites yet</>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
