import React, { useEffect, useState } from "react";

import TrainCard from "./TrainCard";

import { TRAIN_URL } from "../config";

export default function Home() {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    (function() {
      fetch(TRAIN_URL)
        .then(response => response.json())
        .then(data => {
          setTrains(data.sort((a, b) => new Date(a.departure) - new Date(b.departure)));
        });
    })();
  }, []);

  return (
    <ul id="trains">
      {trains.map((t) => (
        <li key={t.id}><TrainCard
          trainObject={t}
        /></li>
      ))}
    </ul>
  );
}

