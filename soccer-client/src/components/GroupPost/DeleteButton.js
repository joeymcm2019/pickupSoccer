import React from 'react';
import DeleteIcon from "@material-ui/icons/Delete";

function DeleteButton(props){
    return (
        <button className='delete-button' onClick={() => props.removeItem(props.id)}>
          <span><DeleteIcon /></span>
        </button>
    );
}

export default DeleteButton;