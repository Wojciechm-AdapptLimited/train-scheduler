import React, { useEffect, useState } from "react";
// import { Link, useParams } from 'react-router-dom';

import TrainCard from "./TrainCard";

import { TRAIN_URL } from "../config";

export default function Home({loggedIn }) {
    const [tickets, setTickets] = useState([]);

    const getTrains = function () {
        fetch(TRAIN_URL)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setTickets(data);
        });
    };

    useEffect(() => {
        getTrains();
    }, []);

    return (
        <div className="column max-height">
            <ul>
                {tickets.map((t) => (
                    <TrainCard
                        trainObject={t}
                        key={t.id}
                        loggedIn={loggedIn}
                    />
                ))}
            </ul>
        </div>
    );
}

