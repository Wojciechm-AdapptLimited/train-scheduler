import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import trainIcon from "./train-sign-svgrepo-com.svg";
import { useParams } from 'react-router-dom';

import "../styles.css";

import { TRAIN_URL } from "../config";
import UserProfile from "../closures/UserProfile";

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
});

const TrainIcon = L.icon({
  iconUrl: trainIcon,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -40],
});

export default function TrainLocation({ trainId }) {
  const [location, setLocation] = useState([52.3246, 18.9967]); //default location - center of poland
  const [trains, setTrains] = useState([]);

  const getLocation = function() {
    fetch(TRAIN_URL + trainId + "/location")
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTrains(data)
      });
  }

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className="column">
      <h3>Current Location:</h3>
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
            <Popup>Train: {trainId}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
