import { FormGroup, InputGroup, Button } from "@blueprintjs/core";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";


function EditUser(props){

    const [userContext, setUserContext] = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const [update, setUpdate] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const REACT_APP_API_ENDPOINT = "http://localhost:3000/";

    const handleUpdate = (e) => {
        e.preventDefault();

        if (email === "" && firstName === "" && lastName === "") {
            setError("No fields were changed. Please try again.");
        } else {
            var emailNew = email;
            var firstNameNew = firstName;
            var lastNameNew = lastName;

            if (email === "") { //no changes to email
                emailNew = userContext.email;
            }
            if (firstName === "") {
                firstNameNew = userContext.firstName;
            }
            if (lastName === "") {
                lastNameNew = userContext.lastName;
            }
            var url = new URL(REACT_APP_API_ENDPOINT + "updateProfile");
            fetch(url, {
                method: "PATCH",
                // Pass authentication token as bearer token in header
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userContext.token}`,
                },
                body: JSON.stringify({ email: emailNew, firstName: firstNameNew, lastName: lastNameNew })
            })
                .then(async (response) => {
                    console.log(JSON.stringify(response));
                    if (!response.ok) {
                        console.log("Something went wrong in update");
                        setError("Error updating profile info");
                        setUpdate(false);
                        return false;
                    } else {
                        const data = await response.json();
                        if (data.success) {
                            console.log("data: " + JSON.stringify(data));
                            setUserContext((prevValues) => {
                                return ({
                                    ...prevValues, email: emailNew, firstName: firstNameNew, lastName: lastNameNew
                                });
                            });
                            setUpdate(true);
                        } else {
                            setUpdate(false);
                            setError("Something went wrong in update");
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setUpdate(false);
                    setError(error);
                })
        }
    }

    useEffect(() => {
        if (update){
            setSuccessMsg("Successfully updated info");
        }
    }, [update])

    //unmount component.
    const returnToProfile = (e) => {
        e.preventDefault();
        console.log("returning to profile");
        setUserContext((prevValues) => {
            return ({...prevValues, updateProfile: false}); //set back to false
        });
    }

    return (
        <div className="inputForm">
            <h2>Edit Profile</h2>
            <h3>Username: {userContext.username}</h3>
            <h3>Current Email: {userContext.email} </h3>
            <h3>New Email: </h3>
            <FormGroup>
                <InputGroup type="email" onChange={(e) => setEmail(e.target.value)}
                    placeholder="Leave blank to keep the same" className='input' value={email} autoComplete="off" />
            </FormGroup>
            <h3>First Name: {userContext.firstName}</h3>
            <FormGroup>
                <InputGroup type="text" onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Leave blank to keep the same" className='input' value={firstName} autoComplete="off" />
            </FormGroup>
            <h3>Last Name: {userContext.lastName}</h3>
            <FormGroup>
                <InputGroup type="text" onChange={(e) => setLastName(e.target.value)}
                    placeholder="Leave blank to keep the same" className='input' value={lastName} autoComplete="off" />
            </FormGroup>
            <form onSubmit={handleUpdate} className="inputForm">
                <Button
                    intent="primary"
                    text={"Submit Changes"}
                    fill
                    type="submit" />
            </form>
            <form onSubmit={returnToProfile} className="inputForm">
                <Button
                    intent="primary"
                    text={"Back to profile"}
                    fill
                    type="submit" />
            </form>
            {error ? <h3>{error}</h3> : <h3>{successMsg}</h3>}
        </div>
    );
}


export default EditUser;