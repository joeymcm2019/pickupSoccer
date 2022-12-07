import React from 'react';

function AddButton(props){
    return (
        <button onClick={() => {
          props.handleSubmit();
        }}>
          <span>+</span>
        </button>
    );
}

export default AddButton;