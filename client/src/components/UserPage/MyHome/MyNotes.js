import React, { useState } from 'react';
import './MyNotes.scss';
import Choose from './Choose';
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { FaPlus } from "react-icons/fa6";
import NoteCard from "./../../Movie/NoteCard";

const MyNotes = ({all, user, updateNotes, notes}) => {
  const [createDisplay, setCreateDisplay] = useState(false);

  const handleClick = () => {
    setCreateDisplay(!createDisplay);
  }
  
  return (
    <div className='myNotesContainer'>
      <button className='addNote' onClick={handleClick}>
        <span><FaPlus /></span></button>
      { createDisplay !== false && 
        (<div className='chooseCard'>
          <Choose 
            all={all}
            user={user}
            notes={notes}
            updateNotes={updateNotes}
            handleClick={handleClick}
          />
        </div>
        )}
    </div>
  );
};

export default MyNotes;
