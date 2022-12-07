import React, { useEffect, useState } from 'react';
import AddButton from './AddButton';




function CustomNote(props){

    const defaultPlaceHolder = "Post to group ..."

    const [content, setContent] = useState("");

     const changeContent = (event) => {
        const value = event.target.value;
        setContent(value);
    }

    const handleSubmit = () => {
        props.addCard(content);
        setContent("");
    }


    return (
        <div className='create-note'>
            <p><input name="content" placeholder={defaultPlaceHolder} type="text" onChange={changeContent} value={content} /></p>
            <AddButton handleSubmit={handleSubmit} />
        </div>
    );


}

export default CustomNote;

/* <div className='create-note'>
<h1><input name="title" placeholder='Title' type="text" onChange={props.changeTitle} value={props.title}/></h1>
<p><input name="content" placeholder='Content' type="text" onChange={props.changeContent} value={props.content}/></p>
<AddButton addItem={props.addItem}/>
</div> */