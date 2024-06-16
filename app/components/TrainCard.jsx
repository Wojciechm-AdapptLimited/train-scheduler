import React, { useEffect, useState } from "react";
import "../styles.css";
import { Link, BrowserRouter } from "react-router-dom";
//import { Link } from 'react-router-dom';

import UserProfile from "../closures/UserProfile";
import { SEAT_URL, TICKET_URL } from "../config";


export default function TrainCard({ trainObject, loggedIn }) {
    
    // const normalTickets = watch("normal_tickets", 0);
    // const reducedTickets = watch("reduced_tickets", 0);
    const [boughtSeat, setBoughtSeat] = useState("");
    const [reservationId, setReservationId] = useState("");
    const [message, setMessage] = useState("");
    const [seats, setSeats] = useState([]);
    const [updating, setUpdating] = useState(false);

    useEffect(()=>{
            getSeats();
        // if (loggedIn){
        //     getReservedSeat();
        // }
    },[])

    const getSeats = function () {
        // put request to db here
        fetch(SEAT_URL + trainObject.id)
        .then(response => response.json())
        .then(data => {
            console.log(data);
                setSeats(data);
        });
    };

    // const getReservedSeat = function(){
    //     fetch(SERVER_URL+`passengers/${trainObject.id}`)
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log("Passangers data "+data);
    //         const login = UserProfile.get();
    //         const seat = data.find((p) => p.name === login);
    //         if (seat){
    //             setBoughtSeat(seat);
    //         }
    //     });
    // }

    return (
        <div className="row border-low padding shadow wider">
            {/* <Link to={}><h1>{}</h1></Link> */}
            <div className="column">
                <h2>From: {trainObject.from_station}</h2>
                <div>Leaves: {trainObject.departure.toString()}</div>
                <h2>To: {trainObject.to_station}</h2>
                <div>Arrives: {trainObject.arrival.toString()}</div>
                <div>
                    <Link to={`/train/${trainObject.id}`}>Locate train</Link>
                </div>
            </div>
        </div>
    );
}

