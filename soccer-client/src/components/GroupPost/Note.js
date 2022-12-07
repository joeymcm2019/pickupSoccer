import React, { useContext } from 'react';
import DeleteButton from './DeleteButton';
import { UserContext } from '../UserContext';

function Note(props){

    const [userContext, setUserContext] = useContext(UserContext);

    return (
        <div className='note'>
            <p>{userContext.username}: {props.content}</p>
            <DeleteButton removeItem={props.removeItem} id={props.id} />
        </div>
    );
}

export default Note;

  