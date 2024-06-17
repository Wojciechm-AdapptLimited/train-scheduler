import React from "react";
import "../styles.css";
import { Link } from "react-router-dom";


export default function TrainCard({ trainObject }) {

  return (
    <section>
      <div className="trainInfo">
        <h2>{trainObject.from_station} - {trainObject.to_station}</h2>
        <p>Leaves: {trainObject.departure.toString()}</p>
        <p>Arrives: {trainObject.arrival.toString()}</p>
      </div>
      <Link to={`/train/${trainObject.id}`}><h2>Details</h2></Link>
    </section >
  );
}

