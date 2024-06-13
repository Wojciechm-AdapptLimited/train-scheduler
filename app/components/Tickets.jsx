import React, { useEffect, useState } from "react";
// import { Link, useParams } from 'react-router-dom';

import TicketCard from "./TicketCard";

export default function Home({ serverUrl, loggedIn }) {
    const [tickets, setTickets] = useState([]);
    //console.log("hey "+page);
    // if(page){
    //     setPageCount(Number(page));
    // }

    const getTickets = function () {
        // put request to db here
        fetch(serverUrl+"tickets")
        .then(response => response.json())
        .then(data => {
            setTickets(data);
            console.log(data);
        });
        // return Array(5).fill({
        //     id: 1,
        //     stationStart: "Poznań Główny",
        //     stationEnd: "Kraków Główny",
        //     start: new Date(2024, 6, 20, 7, 30),
        //     end: new Date(2024, 6, 20, 15, 30),
        //     seats: ["A1","A2","A3","B1","B2","B3"]
        // });
    };

    useEffect(() => {
        getTickets();
    }, []);

    return (
        <div class="column max-height">
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

