import axios from "axios";
import { useContext, useRef, useState } from "react";
import "./register.css";
// import { useHistory } from "react-router";
import { Link, Grid } from "@material-ui/core";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";


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
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Trojan Family</h3>
          <span className="loginDesc">
            Connect with current students and alumni on Trojan Family.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={(e) => {
            e.preventDefault();
          }}
            ref={form}
          >
            <input
              placeholder="Username"
              required
              ref={username}
              className="loginInput"
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
              type="email"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
            <button className="loginButton" onClick={() => {
              console.log("Submit Form!")
              handleClick()
            }}>
              Sign Up&Log in
            </button>

            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Link href='/login'>
                Log into Account
              </Link>
            </Grid>
          </form>
        </div>
      </div>
    </div >
  );
}
