import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import UserProfile from "../closures/UserProfile";
import { TRAIN_URL, TICKET_URL } from "../config";


export default function BuyTicket({ trainId, getTickets }) {
  const {
    register,
    handleSubmit,
  } = useForm();
  const [seats, setSeats] = useState([]);

  const fetchSeats = () => {
    fetch(TRAIN_URL + trainId + "/seat")
      .then(response => response.json())
      .then(data => {
        setSeats(data.filter(s => !s.occupied));
      });
  }

  const onSubmit = (data) => {
    data.train_id = trainId;
    const login = UserProfile.get();

    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + login
      },
      body: JSON.stringify(data)
    };

    fetch(TICKET_URL, requestOptions);
    fetchSeats();
    getTickets();
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  return (
    <form id="ticketOrder" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="seat">Select seat:</label>
      {seats.length > 0 && <select id="seat" {...register("seat")} value={seats[0].seat}>
        {seats && seats.map(s =>
          <option key={s.seat}>
            {s.seat}
          </option>
        )}
      </select>}
      <button type="submit">Order</button>
    </form>
  );
}
