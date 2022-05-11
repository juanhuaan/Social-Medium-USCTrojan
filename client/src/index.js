import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import axios from 'axios'

axios.defaults.baseURL = "http://env-v1.eba-pce2husc.us-west-2.elasticbeanstalk.com/api"

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
