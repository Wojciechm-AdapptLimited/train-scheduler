import React, { useEffect, useState } from "react";
// import { Link, useParams } from 'react-router-dom';

import TicketCard from "./TicketCard";

import { GET_TICKETS_URL } from "../config";

export default function Home({loggedIn }) {
    const [tickets, setTickets] = useState([]);
    //console.log("hey "+page);
    // if(page){
    //     setPageCount(Number(page));
    // }

    const getTickets = function () {
        // put request to db here
        fetch(GET_TICKETS_URL)
        .then(response => response.json())
        .then(data => {
            setTickets(data);
            console.log(data);
        });
    };

    useEffect(() => {
        getTickets();
    }, []);

    return (
        <div className="column max-height">
            <ul>
                {tickets.map((t) => (
                    <TicketCard
                        ticketObject={t}
                        key={t.id}
                        loggedIn={loggedIn}
                    />
                ))}
            </ul>
        </div>
    );
}

