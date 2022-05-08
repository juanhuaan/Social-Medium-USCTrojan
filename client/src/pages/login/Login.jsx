import axios from "axios";
import { useContext, useRef, useEffect } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress, Link, Grid } from "@material-ui/core";

export default function Login() {
  const form = useRef();
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch, error } = useContext(AuthContext);



  const emailConstraint = async () => {
    const body = { email: email.current.value }
    const ifExistedEmail = await axios.post(`/auth/ifExistedEmail`, body);
    const ret = ifExistedEmail.data
    if (!ret) {
      console.log('This email is not existed!')
      email.current.setCustomValidity("This email is not existed!")
    } else {
      console.log('This email is existed!')
      email.current.setCustomValidity("")
    }
    return ret;
  }

  const passwordConstraint = async () => {
    try {
      const body = { email: email.current.value, password: password.current.value }
      await axios.post(`/auth/login`, body);
      password.current.setCustomValidity("")
      console.log('password is right!')
      return true;
    } catch (err) {
      console.log('password is wrong!', err)
      password.current.setCustomValidity("This password is not correct!")
      return false
    }

  }
  const handleClick = async () => {
    form.current.reportValidity();
    const constraint = await emailConstraint() && await passwordConstraint() && form.current.checkValidity();
    console.log(constraint)
    if (!constraint) {
      return;
    }
    try {
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
            ref={form}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" disabled={isFetching}
              onClick={() => {
                console.log('onclick')
                handleClick()
              }}>
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <Grid container>
              <Grid item xs>
                <Link href="/register">
                  Forget password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register">
                  Create a New Account
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </div>
  );
}
