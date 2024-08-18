import './Home.scss';
import { Link,userNavigate } from 'react-router-dom';
import { FaGithub } from "react-icons/fa";

const Home = () => {
  return (
    <div className='homeContainer'>
      <h1>Cinephile</h1>
      <h2>Your personal movie tracker</h2>
      <p>Keep track of movies you have watched and all the movies
        that you want to watch in the future.
      </p>
      <div className='signin'><button><Link to="/Login">GET STARTED</Link></button></div>
    
    
    <div className='footer'>
      <span className='github'><FaGithub size={20} /></span></div>
    </div>
  );
};

export default Home;
