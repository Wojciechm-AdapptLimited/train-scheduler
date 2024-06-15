import { useForm } from "react-hook-form";

import UserProfile from "../closures/UserProfile";
import { LOGIN_URL } from "../config";

import "../styles.css";

export default function Login({ loggedIn, login, setLoggedIn }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {

        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + data.login,
            }
        };

        console.log(data);

        fetch(LOGIN_URL,requestOptions)
        .then(response => {
            if(!response.ok) throw new Error(response.status);
            else return response.json();
        })
        .then(data => {
            console.log(data)
            UserProfile.set(data.access_token);
            setLoggedIn(true);
        })
        .catch((error) =>{
            console.log(error);
            this.setState({requestFailed:true});
        })
    };

    const logout = (_) => {
        UserProfile.clear();
        setLoggedIn(false);
    };

    return (
        <div>
            {!loggedIn && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <input
                            id="login"
                            type="text"
                            {...register("login", {
                                required: "Username is required",
                            })}
                        />
                        {errors.login && (
                            <p className="error">{errors.login.message}</p>
                        )}
                    </div>
                    <button type="submit">Login</button>
                </form>
            )}
            {loggedIn && (
                <div>
                    <div>Logged in as: {login}</div>
                    <button onClick={logout}>Logout</button>
                </div>
            )}
        </div>
    );
}
