import React, { useState } from "react";
import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import "./login.css";


function login ({setShowLogin, myStorage, setCurrentUser}) {
  const [error, setError] = useState(false)
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/users/rlogin", user);
      myStorage.setItem("user",res.data.username)
      setCurrentUser(res.data.username)
      setShowLogin(false)
      setError(false);

    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
    <div className="logo">
      <Room/>
      Clip Trip
    </div>
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="username" ref={usernameRef}></input>
      <input type="password" placeholder="password" ref={passwordRef}></input>
      <button className="loginBtn">login</button>
      {error && <span className="failure">Something went Wrong!</span>}
    </form>
    <Cancel
        className="loginCancel"
        onClick={() => setShowLogin(false)}
      />
    </div>
  )
}


export default login;
