import React,{ useEffect, useState } from "react";
// import { Link, useParams } from 'react-router-dom';

import TicketCard from "./TicketCard";

export default function Home({serverUrl}) {
    const [tickets, setTickets] = useState([]);
    //console.log("hey "+page);
    // if(page){
    //     setPageCount(Number(page));
    // }

    useEffect(()=>{
        setTickets(Array(5).fill(
            {   
                id: 1,
                stationStart:"Poznań Główny",
                stationEnd: "Kraków Główny",
                start: new Date(2024,6,20,7,30),
                end: new Date(2024,6,20,15,30)
            }))
    },[]);

    return(<div class="column tickets">
        <ul>
          {tickets.map(t => <TicketCard ticketObject={t} key={t.id}/>)}
        </ul>
    </div>)
}