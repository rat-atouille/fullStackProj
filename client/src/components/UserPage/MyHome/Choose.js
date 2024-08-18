import React, { useState } from 'react';
import './Choose.scss';
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { FaStar, FaRegStar } from "react-icons/fa";
import axios from 'axios';

const Choose = ({ all, user, notes, updateNotes, handleClick }) => {
  const [title, setTitle] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [movieTitle, setMovieTitle] = useState('');

  const handleCreate = () => {
    const movie_id = selectedOption;
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    if (rating === 0) {
      alert("Rating cannot be 0");
    } else {
      // Post request to create a note
      axios.post('http://localhost:5000/api/movies/create_note', {
        user,
        movie_id,
        title,
        movie_title: movieTitle, // Include movieTitle in the request
        rating,
        date,
        comment
      })
      .then(response => {
        updateNotes(response.data, 1);
        alert("Note has been added!");
        handleCancel();
      })
      .catch(error => {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 409) {
            alert("Selected movie already has an existing note");
          } else {
            alert("Failed to add the note :(");
          }
        }
      });
    }
  };

  // Cancel button handler
  const handleCancel = () => {
    handleClick();
  };

  // Rating handler
  const changeStar = (num) => {
    setRating(num === rating ? 0 : num); // Toggle rating if the same star is clicked
  };

  // Set selected movie and its title
  const setThings = (id) => {
    const selectedMovie = all.find(movie => movie.movie_id == id);
    setSelectedOption(id);
    setMovieTitle(selectedMovie ? selectedMovie.title : '');
  }

  return (
    <div className='choose'>
      <h2>Create a note <span><PiPencilSimpleLineFill size={20} /></span></h2>
      <select 
        value={selectedOption} 
        onChange={(e) => setThings(e.target.value)}
      >
        <option value="" disabled>Select a movie</option>
        {all && all.map((item) => (
          <option key={item.movie_id} value={item.movie_id}>
            {item.title}
          </option>
        ))}
      </select>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Quick review of the movie..'
      />

      <input
        type='text'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Write a review..'
      />
      <div className='rateMovie'> 
        <p>Rating</p>
        {[1, 2, 3, 4, 5].map(num => (
          <span
            key={num}
            onClick={() => changeStar(num)}
            className='star'
          >
            {rating >= num ? <FaStar /> : <FaRegStar />}
          </span>
        ))}
      </div>
      <div className='buttons'>
        <button className="create" onClick={handleCreate}>Create</button>
        <button className="cancel" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default Choose;
