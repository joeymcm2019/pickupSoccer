//require("dotenv").config();
import React, { useState, useContext, useCallback, useEffect } from "react";
import Footer from './Footer';
import Header from './Header';
//import uuid from 'react-uuid';
import Login from "./Login"
import Register from "./Register";
import { UserContext } from "./UserContext";
import Welcome from "./Welcome";
import { Tab, Tabs } from "@blueprintjs/core";
import Loader from "./Loader";


function App() {

  const REACT_APP_API_ENDPOINT = "http://localhost:3000/";

  const [userContext, setUserContext] = useContext(UserContext);
  const [currentTab, setCurrentTab] = useState("login");

  //const [registered, setRegistration] = useState(false);

  // function checkAuthentication() {
  //   var url = new URL(REACT_APP_API_ENDPOINT);
  //   fetch(url, {
  //     method: "GET",
  //   })
  //     .then(async (response) => {
  //       console.log(response);
  //       if (!response.ok) {
  //         console.log("Something went wrong in checking authentication");
  //         return false;
  //       } else {
  //         const data = await response.json();
  //         console.log("login data response in app.js: " + data.success);
  //         if (data.success){
  //           setLogIn(true);
  //         } else {
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  //setLogIn(checkAuthentication());
  //checkAuthentication();

  //-----------------------change to refresh token function--------------------
  // const getUser = (token) => {
  //   console.log("token :" + token);
  //   if (token === undefined) {
  //     console.log("user token undefined");
  //     return;
  //   }
  //   console.log("getting user: ");
  //   var url = new URL(REACT_APP_API_ENDPOINT);
  //   fetch(url, {
  //     method: "GET",
  //     // Pass authentication token as bearer token in header
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     }
  //   })
  //     .then(async (response) => {
  //       console.log(response);
  //       if (!response.ok) {
  //         console.log("Something went wrong in checking authentication");
  //         return false;
  //       } else {
  //         const data = await response.json();
  //         if (data.success) {
  //           console.log("data: " + data.email);
  //           setUserContext((prevValues) => {
  //             return ({
  //               ...prevValues, username: data.username, email: data.email,
  //               firstName: data.firstName, lastName: data.lastName,
  //               token: token
  //             });
  //           })
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  // }


 // console.log(JSON.stringify(userContext));

//  <div className="standardDiv">
//  <Header />
//  {
  return (
    <div>
      <Header />
      <div className="center">
        <div className="standardDiv colorBackground">
          {userContext.token === undefined ? (
            <Tabs id="Tabs" onChange={setCurrentTab} selectedTabId={currentTab}>
              <Tab id="login" title="Login" panel={<Login />} />
              <Tab id="register" title="Register" panel={<Register />} />
              <Tabs.Expander />
            </Tabs>
          ) : userContext.token ? (
            <Welcome />
          ) : (
            <Loader />
          )
          }
        </div>
      </div>
    </div>
  );
}

export default App;


// return (
//   <div>
//     <Header />
//     {userContext.token ? <Welcome /> : <Login login={changeLoginState}/>}
//     {!userContext.token && <Register />}
//     <Footer />
//   </div>
//  ); 