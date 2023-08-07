import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import CardPeople from "../component/cardPeople.jsx"
import CardPlanets from "../component/cardPlanets.jsx";
import CardVehicles from "../component/cardVehicles.jsx"

export const Home = () => {
	const { store, actions } = useContext(Context)
    const [ListPeople, setListPeople] = useState({})
    const [ListVehicles, setListVehicles] = useState({})
    const [ListPlanets, setListPlanets] = useState({})

    //se ejecuta la primera vez que se reenderiza el componente
    useEffect(() => {
        const cargaDatos = async () => {
            let { respuestaJson, response } = await actions.useFetch("/people")
            if (response.ok) {
                console.log(respuestaJson)
                setListPeople(respuestaJson.results)
            }

            ({ respuestaJson, response } = await actions.useFetch("/starships"))
            if (response.ok) {
                console.log(respuestaJson)
                setListVehicles(respuestaJson.results)
            }

            ({ respuestaJson, response } = await actions.useFetch("/planets"))
            if (response.ok) {
                console.log(respuestaJson)
                setListPlanets(respuestaJson.results)
            }
        }

        cargaDatos()

        const cargaParalelo = async () => {
            let { respuestaJson, response } = await actions.useFetch("/people")
            if (response.ok) {
                console.log("P" + respuestaJson)
                setListPeople(respuestaJson.results)
            }

            ({ respuestaJson, response } = await actions.useFetch("/starships"))
            if (response.ok) {
                console.log("P" + respuestaJson)
                setListVehicles(respuestaJson.results)
            }

            ({ respuestaJson, response } = await actions.useFetch("/planets"))
            if (response.ok) {
                console.log("P" + respuestaJson)
                setListPlanets(respuestaJson.results)
            }

            let promesaPlanets = actions.usefetch2("/planets")
            let promesaVehicle = actions.usefetch2("/vehicles")
            let promesaPeople = actions.usefetch2("/people")

            let [a, b, c] = await Promise.all([promesaPeople, promesaPlanets, promesaVehicle])

            a = await a.json()
            setListPlanets(a.results)

            b = await a.json()
            setListVehicles(b.results)

            c = await a.json()
            setListPeople(c.results)
        }
        cargaParalelo()

    }, [])

    useEffect(() => { }, [ListPeople])
    useEffect(() => { }, [ListVehicles])
    useEffect(() => { }, [ListPlanets])

    return (
        <>
            <h1 className="text-danger">Characters</h1>
            {ListPeople && ListPeople.length > 0 && (

                <div className="container py-2 overflow-auto">
                    <div className="d-flex flex-row flex-nowrap">
                        {ListPeople.map((item, index) => {
                            return (
                                <CardPeople
                                    key={index}
                                    name={item.name}
                                    uid={item.uid} />
                            )
                        })}
                    </div>
                </div>
            )}
            <h1 className="text-danger">Planets</h1>
            {ListPlanets && ListPlanets.length > 0 && (

                <div className="container py-2 overflow-auto">
                    <div className="d-flex flex-row flex-nowrap">
                        {ListPlanets.map((item, index) => {
                            console.log(index)
                            return (
                                <CardPlanets
                                    key={index}
                                    name={item.name}
                                    uid={item.uid} />
                                
                            )
                        })}
                    </div>
                </div>
            )}
            <h1 className="text-danger">Vehicles</h1>
            {ListVehicles && ListVehicles.length > 0 && (

                <div className="container py-2 overflow-auto">
                    <div className="d-flex flex-row flex-nowrap">
                        {ListVehicles.map((item, index) => {
                            return (
                                <CardVehicles />
                                    //key={index}
                                    //name={item.name}
                                    //uid={item.uid} />
                            )
                        })}
                    </div>
                </div>
            )}

        </>
    )
		
};
