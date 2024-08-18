import React from 'react';
import './NoteCard.scss';
import { FaStar, FaRegStar } from "react-icons/fa";
import axios from 'axios';

const NoteCard = ({ user, note, updateNotes }) => {
  
  const handleDelete = (note_id) => {
    axios.post('http://localhost:5000/api/movies/delete_note', {
      user,
      note_id
    })
      .then(response => {
        alert("Deleted!");
        updateNotes(note, 0);
      })
      .catch(error => {
        alert("Unable to delete the note. Try again!");
      });
  }

  return (
    <div key={note.id} className='noteCard'>
      <div className='decor'></div>
      <span className='deleteNote' onClick={() => handleDelete(note.review_id)}>✖</span>
      <h1 className='movieTitle'>{note.movie_title}</h1>
      <div className='rated'>
        {[1, 2, 3, 4, 5].map(num => (
          <span key={num} className='star'>
            {note.rating >= num ? <FaStar /> : <FaRegStar />}
          </span>
        ))}
      </div>
      <h2 className={`noteTitle ${note.title ? 'hasTitle' : ''}`}>
        {note.title}
      </h2>
      <div className='commentSec'>{note.comment}</div>
    </div>
  );
};

export default NoteCard;
