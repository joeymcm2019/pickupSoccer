import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from "./UserContext";
import { Button, FormGroup, InputGroup } from "@blueprintjs/core";

function Login(props) {

    const [username, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [loginAttempt, setLoginAttempt] = useState(false);
    const [userContext, setUserContext] = useContext(UserContext);

    const [error, setError] = useState("");

    const REACT_APP_API_ENDPOINT = "http://localhost:3000/";

    const genericErrorMessage = "Something went wrong";

    const handleLogin = (e) => {
        e.preventDefault();

        var url = new URL(REACT_APP_API_ENDPOINT + "login");
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    if (response.status === 400) {
                        setError("Please fill all the fields correctly!");
                    } else if (response.status === 401) {
                        setError("Invalid username and password combination.");
                        setLoginAttempt(true);
                    } else if (response.status === 500) {
                        console.log(response);
                        const data = await response.json();
                        if (data.message) setError(data.message || genericErrorMessage);
                    } else {
                        setError(genericErrorMessage);
                    }
                } else {
                    const data = await response.json();
                 //   console.log("login data response: " + JSON.stringify(data));
                    const { email, username, firstName, lastName, pickUpGroups, token} = data;
                    if (data.success) {
                        setUserContext((prevValues) => {
                            return ({...prevValues, email, username, firstName, lastName, pickUpGroups, displayGroup: "", token});
                        })
                    }
                }
            })
            .catch((error) => {
                setError(genericErrorMessage);
            });       
    }

        return (
            <div className="inputForm">
                <form onSubmit={handleLogin}>
                    {loginAttempt ? <h2>Login failed. Try again.</h2> : <h2>Login</h2>}
                    <FormGroup>
                        <InputGroup type="username" onChange={(event) => setUser(event.target.value)}
                            placeholder="Username" className='input' value={username} />
                        <InputGroup type="password" onChange={(event) => setPassword(event.target.value)}
                            placeholder="Password" className='input' value={password} />
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



{/* <form onSubmit={formSubmitHandler} className="auth-form">
<FormGroup label="Email" labelFor="email">
  <InputGroup
    id="email"
    placeholder="Email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</FormGroup>
<FormGroup label="Password" labelFor="password">
  <InputGroup
    id="password"
    placeholder="Password"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
</FormGroup>
<Button
  intent="primary"
  disabled={isSubmitting}
  text={`${isSubmitting ? "Signing In" : "Sign In"}`}
  fill
  type="submit"
/>
</form> */}

export default Login;