import React, {useEffect, useState} from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent, useMap} from 'react-leaflet';

import "../styles.css";

export default function TrainLocation(){
    const [location, setLocation] = useState([52.3246, 18.9967]); //default location - center of poland
    const [trains, setTrains] = useState([]);

    return(<div class="column">
        <MapContainer
            center={location}
            zoom={6}
            style={{height: '480px', width: '480px'}}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
        </MapContainer>
    </div>)
}