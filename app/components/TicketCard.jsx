import React, { useState } from "react";
import "../styles.css";
import { Link, BrowserRouter } from "react-router-dom";
import { useForm } from "react-hook-form";
//import { Link } from 'react-router-dom';

export default function TicketCard({ ticketObject, loggedIn }) {
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        watch,
        formState: { errors },
    } = useForm();
    // const normalTickets = watch("normal_tickets", 0);
    // const reducedTickets = watch("reduced_tickets", 0);
    const [boughtSeat, setBoughtSeat] = useState("");


    const onSubmit = (data) => {
        // const totalTickets =
        //     Number(data.normal_tickets) + Number(data.reduced_tickets);
        // if (totalTickets <= 0) {
        //     setError("totalTickets", {
        //         type: "manual",
        //         message: "The sum of tickets must be greater than 0",
        //     });
        //     return null;
        // }

        data.id = ticketObject.id;

        console.log("Form data:", data);

        setBoughtSeat(data.seat);
    };

    const update = (data) => {
        setBoughtSeat("");
    };

    const cancel = (data) => {
        setBoughtSeat("");
    };

    return (
        <div class="row border-low padding shadow">
            {/* <Link to={}><h1>{}</h1></Link> */}
            <div class="column">
                <h2>From: {ticketObject.stationStart}</h2>
                <div>Leaves: {ticketObject.start.toString()}</div>
                <h2>To: {ticketObject.stationEnd}</h2>
                <div>Arrives: {ticketObject.end.toString()}</div>
                <div>
                    <Link to={`/train/${ticketObject.id}`}>Locate train</Link>
                </div>
            </div>
            <div >
            {loggedIn && boughtSeat === "" && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>Select seat:</label>
                    <select {...register("seat")}>
                        {ticketObject.seats.map(s =>
                            <option>
                                {s}
                            </option>
                        ) }
                    </select>
                    {/* <div>Normal tickets:</div>
                    <input
                        type="number"
                        step="1"
                        min="0"
                        {...register("normal_tickets")}
                    />
                    <div>Reduced tickets:</div>
                    <input
                        type="number"
                        step="1"
                        min="0"
                        {...register("reduced_tickets")}
                    ></input> */}


                    {errors.totalTickets && (
                        <p class="error">{errors.totalTickets.message}</p>
                    )}

                    <button>Buy ticket</button>
                </form>
            )}
            {loggedIn && boughtSeat !== "" && <div>
                <div>Reserved seat: {boughtSeat}</div>
                <button onClick={update}>Update</button>
                <button onClick={cancel}>Cancel</button>
                </div>}
            </div>
        </div>
    );
}

