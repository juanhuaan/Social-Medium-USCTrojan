import axios from "axios";
import { useContext, useRef, useState } from "react";
import "./register.css";
// import { useHistory } from "react-router";
import { Grid, withTheme } from "@material-ui/core";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom"

export default function Register() {
  const form = useRef();
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  // const history = useHistory();
  const { dispatch } = useContext(AuthContext);

  const passwordAgainConstraint = () => {
    const ret = passwordAgain.current.value === password.current.value
    if (!ret) {
      console.log("Passwords don't match!")
      passwordAgain.current.setCustomValidity("Passwords don't match!")
    } else {
      passwordAgain.current.setCustomValidity("")
    }
    // form.current.reportValidity();
    return ret
  };

  const usernameConstraint = async () => {
    const body = { username: username.current.value }
    const ifExistedUsername = await axios.post(`/auth/ifExistedUsername`, body);
    const ret = ifExistedUsername.data
    console.log('ret', ret)
    if (ret) {
      console.log("Exsisting username!")
      username.current.setCustomValidity("Exsisting username!")
    } else {
      username.current.setCustomValidity("")
    }
    // form.current.reportValidity();
    return !ret;
  }

  const emailConstraint = async () => {
    const body = { email: email.current.value }
    const ifExistedEmail = await axios.post(`/auth/ifExistedEmail`, body);
    const ret = ifExistedEmail.data
    if (ret) {
      console.log("Exsisting email!")
      email.current.setCustomValidity("Exsisting email!")
    } else {
      email.current.setCustomValidity("")
    }
    // form.current.reportValidity();
    return !ret;
  }

  const handleClick = async () => {
    form.current.reportValidity();
    const constraint = await usernameConstraint() && await emailConstraint() && passwordAgainConstraint() && form.current.checkValidity();

    if (!constraint) {
      return;
    }
    const user = {
      username: username.current.value,
      email: email.current.value,
      password: password.current.value,
    };
    try {
      await axios.post("/auth/register", user);
      loginCall(
        { email: email.current.value, password: password.current.value },
        dispatch
      )
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <header className="registerHeader">
          <div className="sameline">
            <span className="registerLogo1">USC</span>
            <span className="registerLogo2">Trojan</span>
          </div>
          {/* <span className="registerDesc">
            Connect with current students and alumni on USCTrojan.
          </span> */}
        </header>
        <div className="registerBody">
          <form className="registerBox" onSubmit={(e) => {
            e.preventDefault();
          }}
            ref={form}
          >
            <input
              placeholder="Username"
              required
              ref={username}
              className="registerInput"
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="registerInput"
              type="email"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="registerInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="registerInput"
              type="password"
            />
            <button className="registerButton" onClick={() => {
              console.log("Submit Form!")
              handleClick()
            }}>
              Sign up & Log in
            </button>

            
          </form>
          <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Link to='/login' className="loginLink">
                Log into Account
              </Link>
            </Grid>
        </div>
      </div>
    </div >
  );
}
