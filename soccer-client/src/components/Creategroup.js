import React, { useContext, useEffect, useState, useCallback } from "react";
import { UserContext } from "./UserContext";
import { FormGroup, InputGroup, Button } from "@blueprintjs/core";
import StateInfo from './allStates';
import { nanoid } from "nanoid";

function compr(obj1, obj2) {
    if (obj1.name < obj2.name) {
        return -1;
    }
    if (obj1.name > obj2.name) {
        return 1;
    }
    return 0;
}

const REACT_APP_API_ENDPOINT = "http://localhost:3000/";

function Creategroup(props){

    const [userContext, setUserContext] = useContext(UserContext);
    const [state, setState] = useState("");
    const [cities, setCities] = useState([]);
    const [city, setCity] = useState("");
    const [ageGroup, setAgeGroup] = useState("");
    const [competitiveness, setCompetitiveness] = useState("");
    const [playTimes, setPlayTimes] = useState("");
    const [playArea, setPlayArea] = useState("");
    const [publicOrPrivate, setPublicOrPrivate] = useState("");
    const [timeSelections, setTimeSelections] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [error, setError] = useState("");
    const [complete, setComplete] = useState(false);



    //load States //initialize times
    useEffect(() => {
        var times = [];
        for (var j = 0; j <= 1; j++) {
            for (var i = 1; i <= 12; i++) {
                var amPM = "b";
                if (((j == 0) && (i != 12)) || ((j == 1) && (i == 12))) {
                    amPM = 'am';
                } else if (((j == 1) && (i != 12)) || ((j == 0) && (i == 12))) {
                    amPM = 'pm';
                }
                var time = `${i}:00${amPM}`;
                times.push(time);
            }
        }
        setTimeSelections(times);
    }, []);


    //handle user choosing State. Fetch cities from server.
    useEffect( () => {
        console.log(state);
        if (state === ""){
            console.log("null state");
            return;
        }
        const fetchString = REACT_APP_API_ENDPOINT + "getCity/" + state.replace(/\s/g, "_"); //setup fetch
        var url = new URL(fetchString);
        //console.log("fetching: " + fetchString);
        fetch(url, {   
        method: "GET",
        headers: { "Content-Type": "application/json" }
        })
        .then(async (response) => {
            if (!response.ok) {
                console.log("Error fetching cities?");
            } else {
                const data = await response.json();
                console.log(data);
                if (data.success){
                    setCities([]); //clear out old data
                    setCities(data.cities) //bring in new
                    setCity("");
                    setPublicOrPrivate("");
                    setAgeGroup("");
                }
             //   console.log("login data response: " + JSON.stringify(data));
            }
        })
        .catch((error) => {
            console.log("Error fetching cities: " + error);
        });   
    }, [state]);

    useEffect(() => {
        if (cities === ""){
            console.log("no cities");
            return;
        }
        var citySelection = document.querySelector("#City");
        cities.forEach((c) => {;
            let newOption = new Option(c, c);
            citySelection.add(newOption, undefined);
        });

    }, [cities]);
    
    const handleCreateGroup = (e) => {
        e.preventDefault();
        var fetchString = REACT_APP_API_ENDPOINT + "createGroup";
        const url = new URL(fetchString);
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${userContext.token}`},
            body: JSON.stringify({ state, city, ageGroup, competitiveness, publicOrPrivate,
                playTimes, playArea: playArea, players: [userContext.username], 
                groupName: groupName, groupID: nanoid()})
        })
            .then(async (response) => {
                if (!response.ok) {
                  console.log(error);
                } else {
                    const data = await response.json();
                    if (data.success) {
                        const pickUpGroup = {
                            id: data.id,
                            groupName: groupName
                        }; 
                        console.log("Group creation success");
                        await setUserContext((prevValues) => {
                            const oldGroups = prevValues.pickUpGroups;
                            if (oldGroups === undefined){
                                return ({...prevValues, pickUpGroups: [pickUpGroup]});
                            }
                            else {
                                return ({...prevValues, pickUpGroups: [...oldGroups, pickUpGroup]})
                            }
                        });
                        setComplete(true);
                        console.log("user updated");
                        } 
                        else {
                        console.log("Creation Failure: " + data.msg);
                        }
                    }
            })
            .catch((error) => {
                console.log(error);
            });   
    }

    const updateUserProfile = () => {
        const url = new URL(REACT_APP_API_ENDPOINT + "updateProfileGroups");
        fetch(url, {
            method: "PATCH",
            // Pass authentication token as bearer token in header
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`,
            },
            body: JSON.stringify({ pickUpGroups: userContext.pickUpGroups })
        })
            .then(async (response) => {
                console.log(JSON.stringify(response));
                if (!response.ok) {
                    console.log("Something went wrong in updating profile groups");
                    setError("Error updating profile groups");
                } else {
                    const data = await response.json();
                    if (data.success) {
                        console.log("update profile group report: " + JSON.stringify(data));
                        setUserContext((prevValues) => {
                            return ({...prevValues, groupTab: false}); //all done. Unmount component
                        })
                    } else {
                        console.log("Error in updating groups")
                        setError("Something went wrong in updating profile groups");
                    }
                }
            })
            .catch((error) => {
                console.log("ERROR UPDATING GROUPS: " + error);
                setError(error);
            })
    };

    //update user profile with new group information
    useEffect(() => {
        if (complete){
        updateUserProfile();
        }
    }, [complete])

    const addTimeSelections = useCallback(() => {
        var times = [];
        timeSelections.forEach((time, i) => {
            times.push(<option key={i}>{time}</option>);
        });
        return(times);
    });

    const handleTimes = (event, day) => {
        console.log(playTimes);
        event.preventDefault();
        const newValue = event.target.value;
        setPlayTimes((prevValues) => {
            return ({...prevValues, [day]: newValue});
            
        });
    }

    const addStateOptions = () => {
        const stateInfoSorted = StateInfo.sort(compr);
        var states = [];
        stateInfoSorted.forEach((state, i) => {
            const stateString = `${state.name}-${state.isoCode}`;
            const option = (<option key={i}>{stateString}</option>);
            states.push(option);
        });
        return states;
    }



    return ( 
        <div>
        <form onSubmit={handleCreateGroup}>
            <h2 id="groupForm">Create Group Form </h2> <p id="groupForm">{"(required: *)"}</p>
            <FormGroup className="inputForm">
                <h3>Group Name *</h3>
                <p>What should we call your group?</p>
                <InputGroup type="text" onChange={(event) => setGroupName(event.target.value)}
                    placeholder="Group Name" value={groupName} />
            </FormGroup>
            {groupName != "" ?
                <div>
                    <FormGroup>
                    <h3>Location *</h3>
                        <select id="State" size="1" onChange={(event) => setState(event.target.value)}>
                            <option value={state}>Select State</option>
                            {addStateOptions()}
                        </select>
                    </FormGroup>
                    {cities != "" ?
                        <div>
                            <FormGroup>
                                <select id="City" size="1" onChange={(event) => setCity(event.target.value)}>
                                    <option value={city}>Select City</option>
                                </select>
                            </FormGroup>
                            {city != "" ?
                                <div>
                                    <FormGroup>
                                        <h3>Privacy *</h3>
                                        <p>Public: anyone can join. Private: only join by invite.</p>
                                        <select size="1" onChange={(event) => setPublicOrPrivate(event.target.value)}>
                                            <option value={publicOrPrivate}>Select Privacy</option>
                                            <option>Public</option>
                                            {/* <option>Private</option> */} 
                                        </select>
                                    </FormGroup>
                                    {publicOrPrivate != "Select Privacy" ?
                                        <div>
                                            <FormGroup>
                                                <h3>Age Group *</h3>
                                                <p>What ages are welcome to this pickup soccer group?</p>
                                                <select size="1" onChange={(event) => setAgeGroup(event.target.value)}>
                                                    <option value={ageGroup}>Select Age Group</option>
                                                    <option>All Ages</option>
                                                    <option>Older Adult</option>
                                                    <option>Adult</option>
                                                    <option>Teen</option>
                                                    <option>Kid</option>
                                                </select>
                                            </FormGroup>
                                            {ageGroup != "Select Age Group" ?
                                                <div>
                                                    <FormGroup>
                                                        <h3>Competitiveness</h3>
                                                        <p>What type of play style will this group follow?</p>
                                                        <select size="1" onChange={(event) => setCompetitiveness(event.target.value)}>
                                                            <option value={competitiveness}>Select Competitiveness</option>
                                                            <option>High Intensity</option>
                                                            <option>Casual</option>
                                                            <option>Laid Back</option>
                                                        </select>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <h3>Schedule</h3>
                                                        <p>When will your group most likely play?</p>
                                                        <p>(Note: You can always set things up as you go)</p>
                                                        <select size="1" onChange={(event) => handleTimes(event, "Monday")}>
                                                            <option value={playTimes.monday}>Monday</option>
                                                            {addTimeSelections()}
                                                        </select>
                                                        <select size="1" onChange={(event) => handleTimes(event, "Tuesday")}>
                                                            <option value={playTimes.tuesday}>Tuesday</option>
                                                            {addTimeSelections()}
                                                        </select>
                                                        <select size="1" onChange={(event) => handleTimes(event, "Wednesday")}>
                                                            <option value={playTimes.wednesday}>Wednesday</option>
                                                            {addTimeSelections()}
                                                        </select>
                                                        <select size="1" onChange={(event) => handleTimes(event, "Thursday")}>
                                                            <option value={playTimes.thursday}>Thursday</option>
                                                            {addTimeSelections()}
                                                        </select>
                                                        <select size="1" onChange={(event) => handleTimes(event, "Friday")}>
                                                            <option value={playTimes.friday}>Friday</option>
                                                            {addTimeSelections()}
                                                        </select>
                                                        <select size="1" onChange={(event) => handleTimes(event, "Saturday")}>
                                                            <option value={playTimes.saturday}>Saturday</option>
                                                            {addTimeSelections()}
                                                        </select>
                                                        <select size="1" onChange={(event) => handleTimes(event, "Sunday")}>
                                                            <option value={playTimes.sunday}>Sunday</option>
                                                            {addTimeSelections()}
                                                        </select>
                                                    </FormGroup>
                                                    <div className="inputForm">
                                                        <FormGroup>
                                                            <h3>Play location</h3>
                                                            <p>Add your usual pickup game field location</p>
                                                            <InputGroup type="text" onChange={(event) => setPlayArea(event.target.value)}
                                                                placeholder="location" value={playArea} />
                                                        </FormGroup>
                                                        <Button
                                                            intent="primary"
                                                            text={"Create Pickup Group"}
                                                            fill
                                                            type="submit"
                                                        />
                                                    </div>
                                                </div> :
                                                <></>
                                            }
                                        </div> :
                                        <></>
                                    }
                                </div> :
                                <></>
                            }
                        </div> :
                        <></>
                    }
                </div> :
                <></>
            }
        </form>
            <form onSubmit={() => { props.returnFromCreate() }} className="inputForm">
                <Button
                    intent="primary"
                    text={"Back"}
                    fill
                    type="submit" />
            </form>
        </div>
    );
}

export default Creategroup;