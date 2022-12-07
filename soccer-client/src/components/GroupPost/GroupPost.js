import React, { useState } from "react";
import Note from './Note'
//import Notes from '../notes';
import CustomNote from "./customNote";
import uuid from 'react-uuid';

function GroupPost() {

  function PostNotes({note}) {
     if (note.content != "" && note.content != null) {
       return (
         <Note content={note.content} id={note.id} removeItem={removeItem} />
       );
     } else {
       return null;
     }
   }

  function removeItem(key) {  
    setCards([...cards.filter((item) => item.id != key)]);
  }
  
  const [cards, setCards] = useState([]);

  function addCard(content){
    const newCard = {content: content, id: uuid()};
    const newCards = cards.concat(newCard);
    setCards([...newCards]);
  }

  return <div>
    <CustomNote addCard={addCard} />
    {cards.map((card,i) => <PostNotes note={card} key={i} />)}
  </div>
}

export default GroupPost;
