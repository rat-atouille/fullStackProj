import React, { useState, useEffect } from 'react';
import SearchBox from './SearchBox';
import MovieCard from './MovieCard';
import './Exp.scss';
import axios from 'axios';

const Explore = ({ user }) => {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);

  const search = () => {
    if (inputValue === '') {
      alert("Search cannot be null");
      setResults([]);
    } else {
      fetchMovies(inputValue);
    }
  };

  // fetch movie api
  const fetchMovies = (query) => {
    axios.get(`http://localhost:5000/api/movies/search_movie`, { params: { query } })
      .then(response => {
        console.log(response.data);
        setResults(response.data.results);
        if (response.data.results.length === 0) {
          alert("No movie was found");
        }
      })
      .catch(error => {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 500) {
            console.log("Invalid:", data.error);  
          } else if (status === 400) {
            console.log(data.error);
          }
        }
      }); 
  };  

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  console.log(results);
  return (
    <div className='container'>
        <div className={`explore_cont ${results.length === 0 ? 'translate' : ''}`}>
          <div className='pageOne'>
            <div className='ftext'>
              <h1>What movie are you watching today?</h1>
            </div>
            <SearchBox 
              inputValue={inputValue}
              handleInputChange={handleInputChange}
              onSearch={search}
            />
          </div>

          <div className='pageTwo'>
            {results.length > 0 && (
              <div className="card-container">  
                {results.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} user={user} />
                ))}
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default Explore;