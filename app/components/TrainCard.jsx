import React, { useEffect, useState } from "react";
import "../styles.css";
import { Link, BrowserRouter } from "react-router-dom";

import UserProfile from "../closures/UserProfile";
import { SEAT_URL, TICKET_URL } from "../config";


export default function TrainCard({ trainObject, loggedIn }) {

    return (
        <div className="row border-low padding shadow wider">
            <div className="column">
                <h2>From: {trainObject.from_station}</h2>
                <div>Leaves: {trainObject.departure.toString()}</div>
                <h2>To: {trainObject.to_station}</h2>
                <div>Arrives: {trainObject.arrival.toString()}</div>
            </div>
            <div className="empty"></div>
            <div>
                <Link to={`/train/${trainObject.id}`}><h1>Ticket page</h1></Link>
            </div>
        </div>
    );
}

