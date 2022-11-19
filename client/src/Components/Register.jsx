import React, { useState } from "react";
import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import "./register.css";


function Register(setShowRegister) {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("/users/register", newUser);
      setError(false);
      setSuccess(true);

    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="registerContainer">
    <div className="logo">
      <Room/>
      Clip Trip
    </div>
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="username" ref={usernameRef}></input>
      <input type="email" placeholder="email" ref={emailRef}></input>
      <input type="password" placeholder="password" ref={passwordRef}></input>
      <button className="registerBtn">Register</button>
      {success && (<span className="success">Successfull you can login now!</span>)}
      {error && <span className="failure">Something went Wrong!</span>}
    </form>
    <Cancel
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  )
}


export default Register;
