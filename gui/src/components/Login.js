import {useForm} from "react-hook-form";

import UserProfile from "../closures/UserProfile";

import "../styles.css"

export default function Login({loggedIn, login, setLoggedIn}){
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => {
        UserProfile.set(data.username)
        setLoggedIn(true);
    };

    const logout = data => {
        UserProfile.clear();
        setLoggedIn(false);
    }

    return(<div>
        {!loggedIn &&
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <input id="username" type="text" {...register('username', { required: 'Username is required' })}
            />
            {errors.username && <p class="error">{errors.username.message}</p>}
            </div>
            <button type="submit">Login</button>
        </form>}
        {loggedIn &&
        <div>
            <div>Logged in as: {login}</div>
            <button onClick={logout}>Logout</button>
        </div>}
    </div>)
}