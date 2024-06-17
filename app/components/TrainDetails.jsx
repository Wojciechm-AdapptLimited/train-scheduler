import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { TICKET_URL, TRAIN_URL } from "../config";
import TrainLocation from "./TrainLocation";
import BuyTicket from "./BuyTicket";
import UserProfile from "../closures/UserProfile";
import ManageTicket from "./ManageTicket";


export default function TrainDetails() {
  const { train_id } = useParams();
  const [trainInfo, setTrainInfo] = useState({
    train_id: 0,
    from_station: "",
    to_station: "",
    departure: new Date(),
    arrival: new Date(),
  });
  const [tickets, setTickets] = useState([]);

  const getTickets = function() {
    const requestOptions = {
      headers: {
        'Authorization': 'bearer ' + UserProfile.get()
      },
    };
    fetch(TICKET_URL, requestOptions)
      .then(response => response.json())
      .then(data => {
        data = data.filter((t) => t.train === Number(train_id));
        console.log("Ticket data " + data);
        setTickets(data);
      });
  }


  useEffect(() => {
    fetch(TRAIN_URL + train_id)
      .then(response => response.json())
      .then(data => {
        setTrainInfo(data);
      });
    getTickets();
  }, []);

  return (
    <section id="train">
      <div id="trainHeader">
        <div className="trainInfo">
          <h2>{trainInfo.from_station} - {trainInfo.to_station}</h2>
          <p>Leaves: {trainInfo.departure.toString()}</p>
          <p>Arrives: {trainInfo.arrival.toString()}</p>
        </div>
        {UserProfile.get().length > 0 && <BuyTicket trainId={train_id} getTickets={getTickets} />}
      </div>
      <div id="trainDetails">
        <TrainLocation trainId={train_id} />
        <table>
          <thead>
            <tr>
              <th>Passenger</th>
              <th>Seat</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id}>
                <ManageTicket trainId={train_id} ticket={t} getTickets={getTickets} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
