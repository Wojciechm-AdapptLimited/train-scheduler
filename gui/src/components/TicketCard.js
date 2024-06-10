import React from "react";
import "../styles.css";
//import { Link } from 'react-router-dom';

export default function TournCard({ticketObject}) {
    return(
        <div class="column border-low padding shadow">
            {/* <Link to={}><h1>{}</h1></Link> */}
            <h2>From: {ticketObject.stationStart} To: {ticketObject.stationEnd}</h2>
            <div>Leaves: {ticketObject.start.toString()}</div>
            <div>Arrives: {ticketObject.end.toString()}</div>
        </div>
    )
}