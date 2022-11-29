import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import SoccerInfo from "./SoccerInfo";
import { Button } from "@blueprintjs/core";
import EditUser from "./EditUser";

function Welcome(){

    const [userContext, setUserContext] = useContext(UserContext);

    const REACT_APP_API_ENDPOINT = "http://localhost:3000/"

    const handleLogout = (e) => {
        e.preventDefault();
        console.log("logging out");
        var url = new URL(REACT_APP_API_ENDPOINT + "logout");
        fetch(url, {
            method: "GET",
        })
            .then(async (response) => {
                console.log(response);
                if (!response.ok) {
                    console.log("Something went wrong in checking authentication");
                    return false;
                } else {
                    const data = await response.json();
                    if (data.success) {
                        setUserContext({});
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const handleUpdate = (e) => {
        e.preventDefault();
        console.log("Updating profile");
        setUserContext((prevValues) => {
            return ({...prevValues, updateProfile: true});
        });
    }

    return (
        <div>
            {(!userContext.groupTab) 
            && (!userContext.updateProfile) ?
                <div>
                    <h2>Welcome {userContext.username}</h2>
                    <h3>{userContext.firstName} {userContext.lastName}</h3>
                    <h3>{userContext.email}</h3>
                    <SoccerInfo />
                    <form onSubmit={handleUpdate} className="inputForm">
                        <Button
                            intent="primary"
                            text={"Edit Profile"}
                            fill
                            type="submit" />
                    </form>
                    <form onSubmit={handleLogout} className="inputForm">
                        <Button
                            intent="primary"
                            text={"Logout"}
                            fill
                            type="submit" />
                    </form>
                   
                </div> :
                <div>
                    {(userContext.updateProfile) ?
                        <EditUser /> :
                        <SoccerInfo />}
                </div>}
        </div>
    );

}




export default Welcome;