import { useForm } from "react-hook-form";
import React, { useState } from "react";
import UserProfile from "../closures/UserProfile";
import { TRAIN_URL, TICKET_URL } from "../config";

import "../styles.css";

export default function ManageTicket({ trainId, ticket, getTickets }) {
  const {
    register,
    handleSubmit,
  } = useForm();
  const [edit, setEdit] = useState(false);
  const [seats, setSeats] = useState([]);

  const fetchSeats = () => {
    fetch(TRAIN_URL + trainId + "/seat")
      .then(response => response.json())
      .then(data => {
        data = data.filter(s => !s.occupied);
        data.push({ seat: ticket.seat });
        setSeats(data);
      });
  }

  const onSubmit = (data) => {
    data.train_id = trainId;
    const login = UserProfile.get();

    const requestOptions = {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + login
      },
      body: JSON.stringify(data)
    };

    fetch(TICKET_URL + ticket.id, requestOptions);
    setEdit(false);
    fetchSeats();
    getTickets();
  };

  const deleteTicket = () => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        'Authorization': 'bearer ' + UserProfile.get()
      },
    };
    fetch(TICKET_URL + ticket.id, requestOptions);
    getTickets();
    fetchSeats();
  }

  return (
    <>
      <td>{ticket.login}</td>
      {edit &&
        <>
          <td>
            <form id={ticket.id} onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="seat">Select seat:</label>
              {seats.length > 0 && <select id="seat" {...register("seat")} defaultValue={ticket.seat}>
                {seats && seats.map(s =>
                  <option key={s.seat}>
                    {s.seat}
                  </option>
                )}
              </select>}
            </form>
          </td>
          <td>
            <button type="submit" form={ticket.id}>Order</button>
            <button onClick={() => setEdit(false)}>Abort</button>
          </td>
        </>
      }
      {!edit &&
        <>
          <td>{ticket.seat}</td>
          <td>
            <button onClick={() => { setEdit(true); fetchSeats(); }}>Edit</button>
            <button onClick={deleteTicket}>Delete</button>
          </td>
        </>
      }
    </>
  );
}
