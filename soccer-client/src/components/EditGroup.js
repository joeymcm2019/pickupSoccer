import React, { useState, useContext, useEffect, useCallback } from 'react';
import { UserContext } from './UserContext';
import { Button, FormGroup, InputGroup } from "@blueprintjs/core";


function EditGroup(props){

    const [userContext, setUserContext] = useContext(UserContext);
    const [ageGroup, setAgeGroup] = useState("");
    const [competitiveness, setCompetitiveness] = useState("");
    const [playArea, setPlayArea] = useState("");
    const [playTimes, setPlayTimes] = useState("");
    const [timeSelections, setTimeSelections] = useState([]);
    const [error, setError] = useState("");
    const [update, setUpdate] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const REACT_APP_API_ENDPOINT = "http://localhost:3000/";

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

    const addTimeSelections = useCallback(() => {
        var times = [];
        timeSelections.forEach((time, i) => {
            times.push(<option key={i}>{time}</option>);
        });
        return(times);
    });

    const handleTimes = (event, day) => {
        event.preventDefault();
        const newValue = event.target.value;
        setPlayTimes((prevValues) => {
            return ({...prevValues, [day]: newValue});
        });
    }

    const displayTimes = () => {
        var playTimesHTML = [];
        var i = 122;
        for (let day in userContext.playTimes) {
            const html = <p key={i++}>{day}: {userContext.playTimes[day]}</p>
            playTimesHTML.push(html);
        }
        return playTimesHTML;
    }

    useEffect(() => {
        if (update){
            setSuccessMsg("Successfully updated group info!");
        }
    }, [update])


    const handleSubmit = (e) => {
        e.preventDefault();
        if (ageGroup === "" && competitiveness === "" && playArea === "" && playTimes == "") {
            setError("No fields were changed. Please try again.");
        } else {  //get patch request ready
            var ageGroupNew = ageGroup;
            var competitivenessNew = competitiveness;
            var playAreaNew = playArea;
            var playTimesNew = playTimes; 

            if (ageGroup === "") { 
                ageGroupNew = userContext.ageGroup;
            }
            if (competitiveness === "") {
                competitivenessNew = userContext.competitiveness;
            }
            if (playArea === "") {
                playAreaNew = userContext.playArea;
            }
            if (playTimes === ""){
                playTimesNew = userContext.playTimes;
            }
            var url = new URL(REACT_APP_API_ENDPOINT + "updateGroup/" + props.selectedGroupID);
            fetch(url, {
                method: "PATCH",
                // Pass authentication token as bearer token in header
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userContext.token}`,
                },
                body: JSON.stringify({ ageGroup: ageGroupNew, competitiveness: competitivenessNew,
                    playArea: playAreaNew, playTimes: playTimesNew})
            })
                .then(async (response) => {
                    console.log(JSON.stringify(response));
                    if (!response.ok) {
                        console.log("Something went wrong in updating group info");
                        setError("Error updating group info");
                        setUpdate(false);
                    } else {
                        const data = await response.json();
                        if (data.success) {
                            console.log("data: " + JSON.stringify(data));
                            setUserContext((prevValues) => {
                                return ({
                                    ...prevValues, ageGroup: ageGroupNew, playArea: playAreaNew, 
                                    competitiveness: competitivenessNew, playTimes: playTimesNew
                                });
                            });
                            setUpdate(true);
                            setError("");
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

    // ageGroup, city, 
    // state, playArea, playTimes, privacy, competitiveness
    return (
        <div className='inputForm'>
            <h2>Edit Group</h2>
            <h3>Group Name: {props.selectedGroupName}</h3>
            <h3>Location: {userContext.city}, {userContext.state}</h3>
            
            <h3>Current Age Group: {userContext.ageGroup}</h3>
            <h3>Edit: </h3>
            <FormGroup>
                <select size="1" onChange={(event) => setAgeGroup(event.target.value)}>
                    <option value={ageGroup}>Select Age Group</option>
                    <option>All Ages</option>
                    <option>Older Adult</option>
                    <option>Adult</option>
                    <option>Teen</option>
                    <option>Kid</option>
                </select>
            </FormGroup>

            <h3>Current Competitiveness: {userContext.competitiveness}</h3>
            <h3>Edit: </h3>
            <FormGroup>
                <select size="1" onChange={(event) => setCompetitiveness(event.target.value)}>
                    <option value={competitiveness}>Select Competitiveness</option>
                    <option>High Intensity</option>
                    <option>Casual</option>
                    <option>Laid Back</option>
                </select>
            </FormGroup>

            <h3>Current Play Times: </h3>
            {displayTimes()}
            <h3>Edit: </h3>
            <FormGroup className="timeSelections">
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

            <h3>Current Play Area: {userContext.playArea}</h3>
            <h3>Edit: </h3>
            <FormGroup>
                <InputGroup type="text" onChange={(event) => setPlayArea(event.target.value)}
                    placeholder="location" value={playArea} />
            </FormGroup>

            {error ? <h3>{error}</h3> : <h3>{successMsg}</h3>}

            <form onSubmit={handleSubmit}>
                <Button
                    intent="primary"
                    text={"Submit"}
                    fill
                    type="submit"
                />
            </form>
            <form onSubmit={props.returnFromEdit}>
                <Button
                    intent="primary"
                    text={"Back"}
                    fill
                    type="submit"
                />
            </form>
        </div>
    );
}

export default EditGroup;