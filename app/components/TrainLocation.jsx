import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import trainIcon from "./train-sign-svgrepo-com.svg";
import { useParams } from 'react-router-dom';

import "../styles.css";

import { SERVER_URL } from "../config";

let DefaultIcon = L.icon({
    iconUrl: icon,
    iconSize: [25, 41], // size of the icon
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
});

let TrainIcon = L.icon({
    iconUrl: trainIcon,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -40],
});

export default function TrainLocation() {
    const [location, setLocation] = useState([52.3246, 18.9967]); //default location - center of poland
    const [trains, setTrains] = useState([]);
    const [ticketInfo, setTicketInfo] = useState({
        id: 0,
        stationStart: "",
        stationEnd: "",
        start: new Date(),
        end: new Date(),
    });
    const [passangers, setPassangers] = useState([]);
    const { id } = useParams();

    const getTicket = function () {
        // get ticket info from postgres

        // current format
        fetch(SERVER_URL+`ticket/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Ticket data "+data);
            setTicketInfo(data);
        });
    };

    const getPassangers = function () {
        // get train passangers info from postgres

        fetch(SERVER_URL+`passengers/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Passangers data "+data);
            setPassangers(data);
        });
    };

    const getTrain = function () {
        //get train location from cassandra

        fetch(SERVER_URL+`train/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Train data "+data);
            setTrains(data);
        })

        // setTrains([
        //     {
        //         id: 1,
        //         x: 54.3213,
        //         y: 19.3214,
        //     },
        // ]);
    };

    useEffect(() => {
        getTicket();
        getPassangers();
        getTrain();
    }, []);

    return (
        <div className="column">
            <h2>From: {ticketInfo.stationStart}</h2>
            <div>Leaves: {ticketInfo.start.toString()}</div>
            <h2>To: {ticketInfo.stationEnd}</h2>
            <div>Arrives: {ticketInfo.end.toString()}</div>
            <div>Current Location:</div>
            <MapContainer
                center={location}
                zoom={6}
                style={{ height: "480px", width: "480px" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {trains.map((t) => (
                    <Marker icon={TrainIcon} position={[t.x, t.y]}>
                        <Popup>Train: {id}</Popup>
                    </Marker>
                ))}
            </MapContainer>
            <table>
                <tr>
                    <th>Passengers</th>
                    <th>Seats</th>
                </tr>
                {passangers.map((p) => (
                    <tr>
                        <td>{p.name}</td>
                        <td>
                            {p.seat}
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
}
