import React, { useEffect, useState } from "react";
import "../styles.css";
import { Link, BrowserRouter } from "react-router-dom";
import { useForm } from "react-hook-form";
//import { Link } from 'react-router-dom';

import UserProfile from "../closures/UserProfile";
import { SEAT_URL, TICKET_URL } from "../config";


export default function TicketCard({ trainObject, loggedIn }) {
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
    const [updating, setUpdating] = useState(false);

    useEffect(()=>{
            getSeats();
        // if (loggedIn){
        //     getReservedSeat();
        // }
    },[])

    const getSeats = function () {
        // put request to db here
        fetch(SEAT_URL + trainObject.id)
        .then(response => response.json())
        .then(data => {
            console.log(data);
                setSeats(data);
        });
    };

    // const getReservedSeat = function(){
    //     fetch(SERVER_URL+`passengers/${trainObject.id}`)
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log("Passangers data "+data);
    //         const login = UserProfile.get();
    //         const seat = data.find((p) => p.name === login);
    //         if (seat){
    //             setBoughtSeat(seat);
    //         }
    //     });
    // }

    const onSubmit = (data) => {
        data.train_id = String(trainObject.id);
        const login = UserProfile.get();
        // if(updating){
        //     data.reservation_id = String(reservationId);
        // }
        console.log("Form data:", data);

        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+login
            },
            body: JSON.stringify(data)
        };

        //const endpoint = updating?"update":"create";

        fetch(TICKET_URL,requestOptions)
        .then(response => {
            if(!response.ok) throw new Error(response.status);
            else return response.json();
        })
        .then(data => {
            console.log(data)
            // setBoughtSeat(data.seat);
            // setReservationId(data.reservation_id);
            setMessage("Success");
        })
        .catch((error) =>{
            console.log(error);
            setMessage("Failed");
            this.setState({requestFailed:true});
        })
    };

    const update = (data) => {
        setUpdating(true);
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
                <h2>From: {trainObject.from_station}</h2>
                <div>Leaves: {trainObject.departure.toString()}</div>
                <h2>To: {trainObject.to_station}</h2>
                <div>Arrives: {trainObject.arrival.toString()}</div>
                <div>
                    <Link to={`/train/${trainObject.id}`}>Locate train</Link>
                </div>
            </div>
            <div >
            {loggedIn && boughtSeat === "" && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>Select seat:</label>
                    <select {...register("seat")}>
                        {seats.map(s =>
                            <option>
                                {s.seat}
                            </option>
                        ) }
                    </select>

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

