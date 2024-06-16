import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import UserProfile from "../closures/UserProfile";
import { SEAT_URL, TICKET_URL } from "../config";

import "../styles.css";

export default function BuyTicket({ticketObject, trainObject, loggedIn}){
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        watch,
        formState: { errors },
    } = useForm();
    const [shownTicket, setTicket] = useState(ticketObject);
    const [message, setMessage] = useState("");
    const [messageClass, setMessageClass] = useState("success");
    const [buyingMode, setBuyingMode] = useState(ticketObject?false:true);
    const [cancelled, setCancelled] = useState(false);
    const [endpoint, setEndpoint] = useState(TICKET_URL);
    const [method, setMethod] = useState("POST");

    useEffect(()=>{
        console.log(trainObject);
        console.log(shownTicket);
        if (shownTicket){
            updateMode();
            console.log(method);
        }
    },[])

    const setErrorMsg = (msg) =>{
        setMessage(msg);
        setMessageClass("error");
    }
    const setSuccessMsg = (msg) =>{
        setMessage(msg);
        setMessageClass("success");
    }
    const updateMode = ()=>{
        setEndpoint(TICKET_URL + shownTicket.id);
        setMethod("PUT");
    }

    const sendTicket = (data,login)=>{
        const requestOptions = {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+login
            },
            body: JSON.stringify(data)
        };

        fetch(endpoint,requestOptions)
        .then(response => {
            if(!response.ok) throw new Error(response.status);
            else return response.json();
        })
        .then(data => {
            console.log(data)
            setSuccessMsg("Success");
        })
        .catch((error) =>{
            console.log(error);
            setErrorMsg("Failed");
            this.setState({requestFailed:true});
        })
    }

    const onSubmit = (data) => {
        data.train_id = String(trainObject.id);
        const login = UserProfile.get();
        // if(updating){
        //     data.reservation_id = String(reservationId);
        // }
        console.log("Form data:", data);
        sendTicket(data,login);
    };

    const update = (data) => {
        setBuyingMode(true);
        
    };
    const abort = (data) => {
        setBuyingMode(false);
    };

    const cancel = (data) => {
        const login = UserProfile.get()
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+login
            }
        };
        fetch(TICKET_URL+shownTicket.id,requestOptions)
        .then(response => {
            if(!response.ok) throw new Error(response.status);
            else return response.json();
        })
        .then(data => {
            setCancelled(true);
            setSuccessMsg("Cancelled");
        })
        .catch((error) =>{
            console.log(error);
            setErrorMsg("Cancellation Fail");
            this.setState({requestFailed:true});
        })
    };

    return(
        <div>{!cancelled && <div>
            {buyingMode &&
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Select seat:</label>
                <select {...register("seat")}>
                    {trainObject.seats && trainObject.seats.map(s =>
                        <option>
                            {s.seat}
                        </option>
                    ) }
                </select>

                <button>Order</button>
            </form>}
            {shownTicket &&
            <div>
                {/* <div>Reserved seat: {shownTicket.seat}</div> */}
                {!buyingMode && <button onClick={update}>Update</button>}
                {!buyingMode && <button onClick={cancel}>Cancel</button>}
                {buyingMode && shownTicket && <button onClick={abort}>Abort</button>}
            </div>}
            </div>}
            <div className={messageClass}>{message}</div>
        </div>
    );
}