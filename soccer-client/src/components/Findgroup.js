import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from "./UserContext";
import { FormGroup, Button } from "@blueprintjs/core";
import StateInfo from './allStates';
import DisplayGroup from './DisplayGroup';

function compr(obj1, obj2) {
    if (obj1.name < obj2.name) {
        return -1;
    }
    if (obj1.name > obj2.name) {
        return 1;
    }
    return 0;
}

function compr2(obj1, obj2) {
    if (obj1.groupName < obj2.groupName) {
        return -1;
    }
    if (obj1.groupName > obj2.groupName) {
        return 1;
    }
    return 0;
}

//var groupsHTML = []; //holds all html for group selection buttons

const REACT_APP_API_ENDPOINT = "http://localhost:3000/";

function Findgroup(props){

const [userContext, setUserContext] = useContext(UserContext);
const [groups, setGroups] = useState("");
const [state, setState] = useState("");
const [cities, setCities] = useState([]);
const [city, setCity] = useState("");
const [groupsFound, setGroupsFound] = useState(false);
const [resultMsg, setResultMsg] = useState("");
const [joinedGroup, setJoinedGroup] = useState(false);
const [groupsHTML, setGroupsHTML] = useState([]);

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
    console.log("cities changed");
    var citySelection = document.querySelector("#City");
    cities.forEach((c) => {;
        let newOption = new Option(c, c);
        citySelection.add(newOption, undefined);
    });

}, [cities]);

//fetch groups from state and city once city is selected.
useEffect(() => {
    console.log("city changed");
    setGroupsFound(false);
    if (city != ""){
        //city changed getting group
        getGroups();
    }
}, [city]);


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

const getGroups = () => {
    console.log("fetching groups");
    const REACT_APP_API_ENDPOINT = "http://localhost:3000/"
    var url = new URL(REACT_APP_API_ENDPOINT + "findGroups/" + state + "/" + city);
    console.log("group fetch url: " + url);
    fetch(url, {
        method: "GET",
        // Pass authentication token as bearer token in header
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userContext.token}`,
        }
    })
    .then(async (response) => {
        console.log(JSON.stringify(response));
        if (!response.ok) {
            console.log("Something went wrong in getting groups");
        } else {
            const data = await response.json();
            
            if (data.success) {
                console.log("fetch success: " + city);
                console.log(data.groups);
                data.groups = data.groups.sort(compr2);
                setGroupsHTML([]); //reset
                setGroups(data.groups);   
            } else {
                console.log("Failure to fetch group")
            }
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

useEffect(() => {
    if (groups === ""){
        return;
    }
    console.log("groups changed");
    var groupsHTMLtemp = [];
    groups.forEach((group, i) => {
        var groupHTML = (
            <form key={i} onSubmit={(e) => { handleGroupSelection(e, group) }} className="inputForm">
                <Button
                    intent="primary"
                    text={group.groupName}
                    fill
                    type="submit" />
            </form>
        );
        groupsHTMLtemp.push(groupHTML);
        setGroupsHTML(groupsHTMLtemp);
        setGroupsFound(true);
    });
}, [groups]);

const handleGroupSelection = (e, group) => {
    e.preventDefault();
    setUserContext((prevValues) => {
        return ({...prevValues, selectedGroup: true, groupName: group.groupName, 
            groupID: group.id, city: group.city, state: group.state,
            playArea: group.playArea, playTimes: group.playTimes, 
            privacy: group.privacy, competitiveness: group.competitiveness, players: group.players
        });
    });   
}

const returnFromGroup = () => {
    setUserContext((prevValues) => {
        return ({...prevValues, selectedGroup: false});
    });
}

const joinGroup = (e) => {
    e.preventDefault();
    console.log("players: " + userContext.players + " user: " + userContext.username);
    console.log("joining group? " + userContext.players);
    if (userContext.players.find((name) => name === userContext.username)){
        setResultMsg("Error: You're already in that group.");
        setUserContext((prevValues) => {
            return ({...prevValues, selectedGroup: false});
        });
    } else {
        setGroupsFound(false);
        const REACT_APP_API_ENDPOINT = "http://localhost:3000/"
        var url = new URL(REACT_APP_API_ENDPOINT + "joinGroup");
        fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`,
            },
            body: JSON.stringify({ groupID: userContext.groupID, username: userContext.username }),  
        })
        .then(async (response) => {
            if (!response.ok) {
                setResultMsg("Something went wrong in Joining group");
            } else {
                const data = await response.json();
                if (data.success) {
                    //add group to user profile.
                    const pickUpGroup = {
                        id: userContext.groupID,
                        groupName: userContext.groupName
                    }; 
                    await setUserContext((prevValues) => {
                        const oldGroups = prevValues.pickUpGroups;
                        if (oldGroups === undefined){
                            return ({...prevValues, pickUpGroups: [pickUpGroup], selectedGroup: false});
                        }
                        else {
                            return ({...prevValues, pickUpGroups: [...oldGroups, pickUpGroup], selectedGroup: false});
                        }
                    });
                    setJoinedGroup(true); //succesfully joined group. Now update user information
                    setResultMsg("Successfully Joined Group: " + userContext.groupName);
                } else {
                   setResultMsg("Failure to join group");
                }
            }
        })
        .catch((error) => {
            setResultMsg("error: " + error);
        });
    }
}

useEffect(() => {
    if (joinedGroup){
        console.log("updating user profile");
        updateUserProfile();
    }
},[joinedGroup]);

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
                setResultMsg("Error updating profile groups");
            } else {
                const data = await response.json();
                if (data.success) {
                    console.log("update profile group report: " + JSON.stringify(data));
                    getGroups(); //update groups really quick
                    setJoinedGroup(false); //reset this value
                } else {
                    console.log("Error in updating groups")
                    setResultMsg("Something went wrong in updating profile groups");
                }
            }
        })
        .catch((error) => {
            console.log("ERROR UPDATING GROUPS: " + error);
            setResultMsg("Error: " + error);
        })
        setJoinedGroup(false);
};


//console.log("groups" + JSON.stringify(groupsHTML));
// ageGroup, city, 
//state, playArea, playTimes, privacy, competitiveness});
return (
    <div>
        { userContext.selectedGroup ?
            <DisplayGroup selectedGroupID={userContext.groupID} 
                selectedGroupName={userContext.groupName}
                returnFromGroup={returnFromGroup}
                canJoin={true}
                joinGroup={joinGroup}
                /> :
        <div>
            <FormGroup>
                <h2>Find a group near you</h2>
                { resultMsg != "" && <h3>{resultMsg}</h3>}
                <select id="State" size="1" onChange={(event) => setState(event.target.value)}>
                    <option value={state}>Select State</option>
                    {addStateOptions()}
                </select>
            </FormGroup>
            {cities != "" &&
                <FormGroup>
                    <select id="City" size="1" onChange={(event) => setCity(event.target.value)}>
                        <option value={city}>Select City</option>
                    </select>
                </FormGroup>
            }
            {groupsFound &&
                <div>
                    <h3>Pickup Groups: </h3>
                    {groupsHTML}
                </div>
            }
            <hr></hr>
            <form onSubmit={() => { props.returnFromFind() }} className="inputForm">
                <Button
                    intent="primary"
                    text={"Back"}
                    fill
                    type="submit" />
            </form>
        </div>
        }
    </div>
);
}

export default Findgroup;