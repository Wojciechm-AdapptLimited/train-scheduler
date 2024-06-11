import React from "react";
import "../styles.css";
import { Link, BrowserRouter} from 'react-router-dom';
import {useForm} from "react-hook-form";
//import { Link } from 'react-router-dom';

export default function TournCard({ticketObject, loggedIn}) {
    const { register, handleSubmit, setError, clearErrors, watch, formState: { errors } } = useForm();
    const normalTickets = watch('normal_tickets', 0);
    const reducedTickets = watch('reduced_tickets', 0);

    const onSubmit = data => {
        const totalTickets = Number(data.normal_tickets) + Number(data.reduced_tickets);
        if (totalTickets <= 0) {
            setError("totalTickets", { type: "manual", message: "The sum of tickets must be greater than 0" });
            return null;
        }

        data.id = ticketObject.id

        console.log('Form data:', data);
        clearErrors("totalTickets");
    }

    return(
        <div class="row border-low padding shadow">
            {/* <Link to={}><h1>{}</h1></Link> */}
            <div class="column">
            <h2>From: {ticketObject.stationStart}</h2>
            <div>Leaves: {ticketObject.start.toString()}</div>
            <h2>To: {ticketObject.stationEnd}</h2>
            <div>Arrives: {ticketObject.end.toString()}</div>
            <div><Link to={`/train/${ticketObject.id}`}>Locate train</Link></div>
            </div>
            {loggedIn &&
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>Normal tickets:</div>
                <input type="number" step="1" min="0"{...register('normal_tickets')}/>
                <div>Reduced tickets:</div>
                <input type="number" step="1" min="0"{...register('reduced_tickets')}></input>
                
                {errors.totalTickets && <p class="error">{errors.totalTickets.message}</p>}

                <button>Buy ticket</button>
            </form>}
            {}
        </div>
    )
}