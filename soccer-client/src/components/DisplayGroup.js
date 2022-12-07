import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { Button, PopoverPosition } from "@blueprintjs/core";
import EditGroup from './EditGroup';
import GroupPost from './GroupPost/GroupPost';

function DisplayGroup(props){

    const [userContext, setUserContext] = useContext(UserContext);
    const [viewingInfo, setViewingInfo] = useState(false);
    const [buttonText, setButtonText] = useState("View Info");
    const [isCreator, setIsCreator] = useState(false);
    const [editingGroup, setEditingGroup] = useState(false);

    const getGroupInfo = () => {
        const REACT_APP_API_ENDPOINT = "http://localhost:3000/"
        var url = new URL(REACT_APP_API_ENDPOINT + "getGroup/" + props.selectedGroupID);
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
                    console.log("Something went wrong in getting group");
                } else {
                    const data = await response.json();
                    if (data.success) {
                        console.log("successful fetch");
                        console.log("group: " + JSON.stringify(data));
                        const {ageGroup, city, state, playArea, playTimes, players, 
                            privacy, competitiveness, creatorUsername} = data.pickUpGroup;
                        if (userContext.username === creatorUsername){
                            setIsCreator(true);
                        }
                        await setUserContext((prevValues) => {
                            return ({...prevValues, ageGroup, city, 
                            state, playArea, players, playTimes, privacy, competitiveness});
                        });
                        
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
        if (!props.canJoin){
        getGroupInfo();
        }
    }, []);

    //console.log("display group: " + JSON.stringify(userContext.groupName));

    const viewGroupInfo = (e) => {
        e.preventDefault();
        if (buttonText === "View Info"){
            setButtonText("Close");
        } else {
            setButtonText("View Info");
        }
        setViewingInfo(!viewingInfo);
    } 

   // {ageGroup, city, state, playArea, playTimes, privacy, competitiveness} = data.pickUpGroup;
  
   const displayTimes = () => {
    var  playTimesHTML = [];
    var i = 122;
    for (let day in userContext.playTimes){
        const html = <p key={i++}>{day}: {userContext.playTimes[day]}</p>
        playTimesHTML.push(html);
    }
    return playTimesHTML;
   }

   const displayRole = () => {
    if (isCreator){
        return <p>Admin</p>
    } else {
        return <p>Member</p> 
    }
   }
   
   const handleEdit = () => {
        setEditingGroup(!editingGroup);
   }

   console.log("players: " + JSON.stringify(userContext.players));

    return (
        <div>
            {!editingGroup ?
            <div>
                <h2>{props.selectedGroupName}</h2>
                {props.canJoin &&  //option to join if user is viewing group from search
                    <form onSubmit={(e) => { props.joinGroup(e) }} className="inputForm">
                        <Button
                            intent="primary"
                            text={"Join Group"}
                            fill
                            type="submit" />
                    </form>
                }
                {!props.canJoin && 
                    <GroupPost />
                }
                {viewingInfo && //user wants to see more information
                    <div className="viewGroup">
                        <h3>Role</h3>
                        {displayRole()}
                        <h3>Location</h3>
                        <p>{userContext.city}, {userContext.state}</p>
                        <h3>Privacy</h3>
                        <p>{userContext.privacy}</p>
                        <h3>Age Group</h3>
                        <p>{userContext.ageGroup}</p>
                        {(userContext.playArea != "") &&
                            <div>
                                <h3>Play Area</h3>
                                <p>{userContext.playArea}</p>
                            </div>
                        }
                        {(userContext.playTimes != "") &&
                            <div>
                                <h3>Play Times</h3>
                                {displayTimes()}
                            </div>
                        }
                        {(userContext.competitiveness != "") &&
                            <div>
                                <h3>Competitiveness</h3>
                                <p>{userContext.competitiveness}</p>
                            </div>
                        }
                        <h3>Number of Members: {userContext.players && userContext.players.length}</h3> 
                    </div>}
                <form onSubmit={viewGroupInfo}>
                    <Button
                        intent="primary"
                        text={buttonText}
                        fill
                        type="submit"
                    />
                </form>
                { 
                    isCreator &&
                    <form onSubmit={handleEdit}>
                        <Button
                            intent="primary"
                            text={"Edit Group"}
                            fill
                            type="submit"
                        />
                    </form> 
                }
                <form onSubmit={props.returnFromGroup}>
                    <Button
                        intent="primary"
                        text={"Back"}
                        fill
                        type="submit"
                    />
                </form>
            </div> :
                <div>
                    <EditGroup returnFromEdit={handleEdit} selectedGroupID={props.selectedGroupID}
                        selectedGroupName={props.selectedGroupName} />
                </div>
            }
        </div>
    );
}

export default DisplayGroup;