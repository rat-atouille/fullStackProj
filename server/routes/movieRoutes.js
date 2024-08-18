const express = require('express');
const axios = require('axios');
const db = require('../config/db');
const router = express.Router();

const apiKey = process.env.TMDB_API_KEY;

// get user id
function getID(user) {
  return new Promise((resolve, reject) => {
    const idQuery = "SELECT id FROM user_profiles WHERE user_name = ?";
    db.query(idQuery, [user], (err, result) => {
      if (err) {
        console.error(err); // Log the error for debugging
        return reject({ error: 'Server error' });
      }
      if (result.length !== 0) {
        resolve(result[0].id);
      } else {
        resolve(null);
      }
    });
  });
}

// fetch details
async function fetchMovieDetails(movieId) {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: apiKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error.message);
    throw error;
  }
}

// api
router.get('/search_movie', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    console.error('Error: Missing query parameter');
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: apiKey,
        query: query,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    if (error.response) {
      console.error('API response error:', error.response.data);
      return res.status(error.response.status).json({ error: error.response.data });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// load movies to the user page
router.post('/load_data', async (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ error: 'User is required' });
  }

  try {
    const userID = await getID(user);
    if (!userID) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    // Fetch movies from user_wishlist
    const getMoviesQuery = "SELECT * FROM user_wishlist WHERE user_id = ?";
    const moviesPromise = new Promise((resolve, reject) => {
      db.query(getMoviesQuery, [userID], async (err, results) => {
        if (err) {
          console.error(err);
          return reject('Failed to load movies');
        }

        const moviesWithDetails = await Promise.all(results.map(async (movie) => {
          const movieDetails = await fetchMovieDetails(movie.movie_id);
          let movieWithPoster = {
            ...movie,
            poster_url: movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : null,
            title: movieDetails.title,
            release_date: movieDetails.release_date,
            overview: movieDetails.overview,
            vote_average: movieDetails.vote_average,
          };

          if (movie.reviewed !== null) {
            const getReviewsQuery = "SELECT * FROM review_table WHERE review_id = ?";
            const [review] = await new Promise((resolve, reject) => {
              db.query(getReviewsQuery, [movie.reviewed], (err, reviewResults) => {
                if (err) {
                  console.error(err);
                  return reject(err);
                }
                resolve(reviewResults);
              });
            });

            if (review) {
              movieWithPoster = {
                ...movieWithPoster,
                rating: review.rating,
                date: review.date_posted,
                comment: review.comment,
              };
            }
          }

          return movieWithPoster;
        }));

        const movies = moviesWithDetails.map(({ user_id, wishlist_id, ...filteredMovie }) => filteredMovie);
        resolve(movies);
      });
    });

    // Fetch notes from review_table
    const getNotesQuery = `
      SELECT DISTINCT rt.*, 
             uw.movie_id 
      FROM review_table rt 
      JOIN user_wishlist uw ON rt.movie_id = uw.movie_id 
      WHERE rt.user_id = ?
    `;
    const notesPromise = new Promise((resolve, reject) => {
      db.query(getNotesQuery, [userID], async (err, notesResults) => {
        if (err) {
          console.error("SQL Query Error:", err);
          return reject('Failed to load notes');
        }

        const notesWithDetails = await Promise.all(notesResults.map(async (note) => {
          const movieDetails = await fetchMovieDetails(note.movie_id);

          return {
            ...note,
            movie_title: movieDetails.title,
            poster_url: movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : null,
          };
        }));

        resolve(notesWithDetails);
      });
    });

    // Wait for both promises to resolve
    const [movies, notes] = await Promise.all([moviesPromise, notesPromise]);

    // Send the response including both movies and notes
    res.status(200).json({ all_movies: movies, notes: notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// update movie
router.post('/update_movie', async(req, res) => {
  let { movieId, user, category, boolean} = req.body;

  try {
    const userID = await getID(user);
    if (!userID) {
      return res.status(401).json({ error: 'Invalid user' });
    }
    
    if (category === "all") {
      const deleteAll = "DELETE FROM user_wishlist WHERE movie_id = ? AND user_id = ?";
      db.query(deleteAll, [movieId, userID], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to delete movie' });
        }
        res.status(200).json({ mess: "deleted all", deletedMovie: movieId });
      });
    } else {
      if (category === "notes") {
        category = "reviewed";
        return;
      }
      // update the category value to 0 (false)
      const change = `UPDATE user_wishlist SET ${category} = ${boolean} WHERE movie_id = ? AND user_id = ?`;
      db.query(change, [movieId, userID], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to update category' });
        }
        res.status(200).json({ array: "updated", updatedMovie: movieId, category: category, value: boolean });
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' }); 
  }
});

// add movie 
router.post('/add_movie', async (req, res) => {
  const { user, movie_id } = req.body;

  if (!user || !movie_id) {
    return res.status(400).json({ error: 'User and movie ID are required' });
  }

  try {
    const userID = await getID(user);
    if (!userID) {
      return res.status(401).json({ error: 'Invalid user' });
    }
    // reviewed, favourite, watch_later, finished
    const insertMovie = "INSERT INTO user_wishlist (user_id, movie_id, favourite, watch_later, finished) VALUES (?, ?, false, false, false)";
    db.query(insertMovie, [userID, movie_id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to add movie' });
      }
      res.status(202).json({ message: 'Movie added successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// add note 
router.post('/create_note', async (req, res) => {
  const { user, movie_id, title, movie_title, rating, date, comment } = req.body;

  if (!user || !movie_id) {
    return res.status(400).json({ error: 'User and movie ID are required' });
  }

  try {
    // Assuming getID is a function that retrieves the user_id from the user object
    const userID = await getID(user);
    if (!userID) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    // Check for duplicate notes
    const checkDup = "SELECT * FROM review_table WHERE user_id = ? AND movie_id = ?";
    db.query(checkDup, [userID, movie_id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query error' });
      }

      if (result.length > 0) {
        return res.status(409).json({ error: 'Selected movie already has an existing note' });
      }

      // Create the note
      const createNote = "INSERT INTO review_table (user_id, movie_id, title, rating, date_posted, comment) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(createNote, [userID, movie_id, title, rating, date, comment], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to add a note' });
        }

        // Fetch the newly inserted note using the insertId
        const newNoteId = result.insertId;
        const fetchNote = "SELECT review_id, movie_id, title, rating, date_posted AS date, comment FROM review_table WHERE review_id = ?";
        db.query(fetchNote, [newNoteId], (err, noteResult) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve the created note' });
          }

          const newNote = noteResult[0];
          
          // Send the newly created note along with the movie title back to the client
          res.status(201).json({
            ...newNote,
            movie_title // Add movie_title to the response
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// delete note 
router.post('/delete_note', async (req,res) => {
  const { user, note_id } = req.body;

  if (!user || !note_id) {
    return res.status(400).json({ error: 'User and note ID are required' });
  }

  try {
    // Assuming getID is a function that retrieves the user_id from the user object
    const userID = await getID(user);
    if (!userID) {
      return res.status(401).json({ error: 'Invalid user' });
    }
    const deleteQuery = "DELETE FROM review_table WHERE ( user_id = ? AND review_id = ? )";
    db.query(deleteQuery, [userID, note_id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query error' });
      }
      const updateWishlist = "UPDATE user_wishlist SET (reviewed = NULL) WHERE (reviewed = ? )";
      db.query(updateWishlist, [note_id], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database query error' });
        }  
      }) 
      res.status(201).json({ message: 'Note has been deleted' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }


});

module.exports = router;