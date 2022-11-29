import React , { useContext, useState } from 'react';
import regeneratorRuntime from "regenerator-runtime";
import { UserContext } from './UserContext';
import { Button, FormGroup, InputGroup } from "@blueprintjs/core";

function Register() {

    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userContext, setUserContext] = useContext(UserContext);
    const [error, setError] = useState("");

    const genericErrorMessage = "something went wrong";

    const REACT_APP_API_ENDPOINT = "http://localhost:3000/"

    const handleRegister = (e) => {
        e.preventDefault();
        console.log("handling registration!");
        var url = new URL(REACT_APP_API_ENDPOINT + "register");
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName: fName, lastName: lName, email, username, password }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    if (response.status === 400) {
                        setError("Please fill all the fields correctly!");
                    } else if (response.status === 401) {
                        setError("Invalid email and password combination.");
                    } else if (response.status === 500) {
                        const data = await response.json();
                        if (data.message) setError(data.message || genericErrorMessage);
                    } else {
                        setError(genericErrorMessage);
                    }
                } else {
                    const data = await response.json();
                    if (data.success){
                        setUserContext((prevValues) => {
                            return ({...prevValues, pickUpGroups: "", token: data.token, username, 
                            email, firstName: fName, lastName: lName, displayGroup: ""});
                        });
                    } else {
                        setError(genericErrorMessage);
                    }
                }
            })
            .catch((error) => {
                setError(genericErrorMessage);
            });
    }

    return (
        <div className="inputForm">
            <form onSubmit={handleRegister}>
                <h2>Register</h2>
                <FormGroup>
                    <InputGroup type="text" onChange={(e) => setFName(e.target.value)}
                        placeholder="Fist Name" className='input' value={fName} autoComplete="off" />
                    <InputGroup type="text" onChange={(e) => setLName(e.target.value)}
                        placeholder="Last Name" className='input' value={lName} autoComplete="off"/>
                    <InputGroup type="email" onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email" className='input' value={email} autoComplete="off"/>
                    <InputGroup type="text" onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username" className='input' value={username} autoComplete="off" autoSave='off'/>
                    <InputGroup type="password" onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password" className='input' value={password} autoComplete="off" autoSave='off'/>
                    <Button
                        intent="primary"
                        text={"Submit"}
                        fill
                        type="submit"
                    />
                </FormGroup>
            </form>
        </div>
    );
}

export default Register;