import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom'; // Import useNavigate here
import './AllMovies.scss';
import axios from 'axios';
import Movie from "./../../Movie/Movie";
import { MdMovieFilter } from "react-icons/md";
import MyNotes from "./MyNotes";
import NoteCard from "./../../Movie/NoteCard";
import { Link } from 'react-router-dom';

const AllMovies = () => {
  const { all, fav, later, finished, notes, updateNotes, updateMovieLists, user, category } = useOutletContext();
  const [header, setHeader] = useState("");

  useEffect(() => {
    switch (category) {
      case "favourite":
        setHeader("My Favourites");
        break;
      case "watch_later":
        setHeader("Watch Later");
        break;
      case "finished":
        setHeader("Finished Movies");
        break;
      case "notes":
        setHeader("My Notes");
        break;
      default:
        setHeader("All Movies");
    }
  }, [category]);

  const handleToggleCategory = (movieId, cat, boolValue) => {
    axios.post('http://localhost:5000/api/movies/update_movie', {
      movieId,
      user,
      category: cat,
      boolean: boolValue
    })
      .then(response => {
        updateMovieLists(movieId, cat, boolValue);
      })
      .catch(error => {
        console.error('Update failed:', error.data);
      });
  };
  const getContent = () => {
    switch (category) {
      case "favourite":
        return fav;
      case "watch_later":
        return later;
      case "finished":
        return finished;
      default:
        return all;
    }
  };

  const content = getContent();

  const headerClass = () => {
    if (category !== "notes") {
      // When category is not 'notes'
      return content.length > 0 ? 'leftH1' : 'centerH1';
    } else {
      // When category is 'notes'
      return notes.length > 0 ? 'leftH1' : 'centerH1';
    }
  };  

  return (
    <div className='allContainer'>
    <h1 className={`H1 ${headerClass()}`}>
      {header}
    </h1>
    <div className='centerDiv'>
      {content.length > 0 ? (
        category !== "notes" ? (
          <div className='list'>
            {content.map(movie => (
              <Movie
                key={movie.movie_id}
                movie={movie}
                category={category}
                onToggleCategory={handleToggleCategory}
              />
            ))}
          </div>
        ) : (
          <div className='myNotes'>
            <MyNotes 
              all={all}
              user={user}
              notes={notes}
              updateNotes={updateNotes}
            />
            {notes.length > 0 ? (
              <div className='notesList'>
                {notes.map(note => (
                  <NoteCard
                    note={note} 
                    updateNotes={updateNotes}
                    user={user}
                  />
                ))}
              </div>
            ) : (             
              <div className='empty'>
                <span><MdMovieFilter size={100} /></span>
                <p>You have no notes in your list :(</p>
              </div>
            )}
          </div>
        )
      ) : (
        <div className='empty'>
          <span><MdMovieFilter size={100} /></span>
          <p>You have no movies in your list :(</p>
         {category === "all" && (
          <>
            <p className='sub'>Add movies to organize your watch list</p>
            <button><Link to="/Explore">SEARCH </Link></button>
          </>
         )} 
        </div>
      )}
    </div>
  </div>
  )}

export default AllMovies;
  