import React, { useEffect, useState } from "react";
import "../styles.css";
import { Link, BrowserRouter } from "react-router-dom";
import { useForm } from "react-hook-form";
//import { Link } from 'react-router-dom';

import { GET_SEATS_URL } from "../config";
import UserProfile from "../closures/UserProfile";
import { SERVER_URL } from "../config";

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
    const [reservationId, setReservationId] = useState("");
    const [message, setMessage] = useState("");
    const [seats, setSeats] = useState([]);

    useEffect(()=>{
        getSeats();
        if (loggedIn){
            getReservedSeat();
        }
    },[])

    const getSeats = function () {
        // put request to db here
        fetch(GET_SEATS_URL + ticketObject.id)
        .then(response => response.json())
        .then(data => {
            setSeats(data);
            console.log(data);
        });
    };

    const getReservedSeat = function(){
        fetch(SERVER_URL+`passengers/${ticketObject.id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Passangers data "+data);
            const login = UserProfile.get();
            const seat = data.find((p) => p.name === login);
            if (seat){
                setBoughtSeat(seat);
            }
        });
    }

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

        data.train_id = String(ticketObject.id);
        const login = UserProfile.get();
        data.user_id = login
        
        console.log("Form data:", data);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        fetch(SERVER_URL+"reservation/update",requestOptions)
        .then(response => {
            if(!response.ok) throw new Error(response.status);
            else return response.json();
        })
        .then(data => {
            console.log(data)
            setBoughtSeat(data.seat);
            setReservationId(data.reservation_id);
            setMessage("Success");
        })
        .catch((error) =>{
            console.log(error);
            setMessage("Failed");
            this.setState({requestFailed:true});
        })
    };

    const update = (data) => {
        setBoughtSeat("");
    };

    const cancel = (data) => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };
        fetch(SERVER_URL+`reservation/cancel/${reservationId}`,requestOptions)
        .then(response => {
            if(!response.ok) throw new Error(response.status);
            else return response.json();
        })
        .then(data => {
            setBoughtSeat("");
            setMessage("Cancelled");
        })
        .catch((error) =>{
            console.log(error);
            setMessage("Cancellation Fail");
            this.setState({requestFailed:true});
        })
    };

    return (
        <div className="row border-low padding shadow">
            {/* <Link to={}><h1>{}</h1></Link> */}
            <div className="column">
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
                        {seats.map(s =>
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
                        <p className="error">{errors.totalTickets.message}</p>
                    )}

                    <button>Buy ticket</button>
                </form>
            )}
            {loggedIn && boughtSeat !== "" && <div>
                <div>Reserved seat: {boughtSeat}</div>
                <button onClick={update}>Update</button>
                <button onClick={cancel}>Cancel</button>
                </div>}
            <div>{message}</div>
            </div>
        </div>
    );
}

