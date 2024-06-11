import React, {useEffect, useState} from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent, useMap} from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import trainIcon from "./train-sign-svgrepo-com.svg";

import "../styles.css";

let DefaultIcon = L.icon({
    iconUrl: icon,
    iconSize:     [25, 41], // size of the icon
    iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
});

let TrainIcon = L.icon({
    iconUrl: trainIcon,
    iconSize:     [36, 36], 
    iconAnchor:   [18, 36], 
    popupAnchor:  [0, -40] 
});

export default function TrainLocation(){
    const [location, setLocation] = useState([52.3246, 18.9967]); //default location - center of poland
    const [trains, setTrains] = useState([]);

    useEffect(()=>{
        // get trains from cassandra and display

        setTrains([{
            id: 1,
            x: 54.3213,
            y: 19.3214,
        }])
    },[])


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
            {trains.map(t =><Marker
            icon={TrainIcon}
            position={[t.x,t.y]}
            >
                <Popup>Train: {t.id}</Popup>
            </Marker>)
            }
        </MapContainer>
    </div>)
}