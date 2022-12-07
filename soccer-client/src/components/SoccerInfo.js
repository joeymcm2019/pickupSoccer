import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import Findgroup from "./Findgroup";
import Creategroup from "./Creategroup";
import { Button } from "@blueprintjs/core";
import DisplayGroup from "./DisplayGroup";

var selectedGroupID = "";
var selectedGroupName = "";

function SoccerInfo(){

const [userContext, setUserContext] = useContext(UserContext);
const [creatingGroup, setCreatingGroup] = useState(false);
const [findingGroup, setFindingGroup] = useState(false);
const [viewingGroup, setViewingGroup] = useState(false);

const displaySoccerGroups = () => {
    console.log("displaying groups");
    var groups = [];
    if (userContext.pickUpGroups != "" && userContext.pickUpGroups != undefined){
        userContext.pickUpGroups.forEach((group, i) => {
            var groupHTML = (
                <div key={i}>
                    <form onSubmit={(e) => handleGroupView(e, group.id, group.groupName)}>
                        <Button
                            intent="primary"
                            text={group.groupName}
                            fill type="submit"
                        />
                    </form>
                </div>
            );
           groups.push(groupHTML);
        });
        return groups;
    } else {
        return null;
    }
};


function handleGroupView(e, id, name){
    e.preventDefault();
    selectedGroupID = id;
    selectedGroupName = name;
    setViewingGroup(!viewingGroup);
}

const returnFromGroup = (e) => {
    e.preventDefault();
    console.log("returning from group view");
    setViewingGroup(!viewingGroup);
}

const handleCreateGroup = (e) => {
    e.preventDefault();
    setCreatingGroup(!creatingGroup);
}

const handleFindGroup = (e) => {
    e.preventDefault();
    setFindingGroup(!findingGroup);
}

const handleGroups = (e) => {
    e.preventDefault();
    setUserContext((prevValues) => {
        return ({...prevValues, groupTab: !userContext.groupTab})
    })
}

const returnFromCreate = () => {
    setCreatingGroup(!creatingGroup);
}

const returnFromFind = () => {
    setFindingGroup(!findingGroup);
}


    return (
        <div>
            {!userContext.groupTab ?
                <form onSubmit={handleGroups}>
                    <Button
                        intent="primary"
                        text={"Pickup Groups"}
                        fill
                        type="submit"
                    />
                </form> :
                <div>
                    {creatingGroup || findingGroup ?
                        creatingGroup ?
                            <div>
                                <Creategroup returnFromCreate={returnFromCreate} />
                            </div> :  //if create group wasn't pressed, findGroup was
                            <div>
                                <Findgroup returnFromFind={returnFromFind} />
                            </div> :

                        <div> {/**if not finding or creating, show menu  **/}
                            {viewingGroup ? 
                            <DisplayGroup selectedGroupID={selectedGroupID} 
                                selectedGroupName={selectedGroupName}
                                returnFromGroup={returnFromGroup}
                                canJoin={false}
                                /> :
                                <div>
                                    {userContext.pickUpGroups.length === 0 ?
                                        <h3>You haven't joined any pickup groups</h3> :
                                        <div>
                                            <h2>Groups You're In:</h2>
                                            {displaySoccerGroups()}
                                        </div>}
                                    <hr></hr>
                                    <div className="inputForm">
                                        <form onSubmit={handleCreateGroup}>
                                            <Button
                                                intent="primary"
                                                text={"Create Pickup Group"}
                                                fill
                                                type="submit"
                                            />
                                        </form>
                                        <form onSubmit={handleFindGroup}>
                                            <Button
                                                intent="primary"
                                                text={"Find Pickup Group"}
                                                fill
                                                type="submit"
                                            />
                                        </form>
                                        <form onSubmit={handleGroups}>
                                            <Button
                                                intent="primary"
                                                text={"Home"}
                                                fill
                                                type="submit"
                                            />
                                        </form>
                                    </div>
                                </div>}
                        </div>}
                </div>}
        </div>
    );
}


export default SoccerInfo;