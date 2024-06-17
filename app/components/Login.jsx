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
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json',
      },
      body: `grant_type=&username=${data.login}&password=1234&scope=&client_id=&client_secret=`
    };

    fetch(LOGIN_URL, requestOptions)
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(data => {
        console.log(data)
        UserProfile.set(data.access_token);
        setLoggedIn(true);
      })
      .catch((error) => {
        console.log(error);
      })
  };

  const logout = (_) => {
    UserProfile.clear();
    setLoggedIn(false);
  };

  return (
    <>
      {!loggedIn && (
        <form id="login" onSubmit={handleSubmit(onSubmit)}>
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
          <button type="submit">Login</button>
        </form>
      )}
      {loggedIn && (
        <div id="login">
          <p>Logged in as: {login}</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </>
  );
}
