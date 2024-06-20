import {  useEffect, useRef, useState } from "react";
// import'./popcorn.css';
import './index.css';
import StarRatin from "./Star";
// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [selected,setSelected] = useState(null)
  
  const [watched, setWatched] = useState(function(){

    const data = localStorage.getItem('WatchedMovie');
    return data ? JSON.parse(data) : []
  });

useEffect(function(){
  localStorage.setItem('WatchedMovie', JSON.stringify(watched));
}, [watched]);


// console.log(selected);
  // console.log(watched[0]);
  useEffect(function(){

    async function FetchMovie(){
      try{
        setLoading(true)
        setError('')
        const data= await fetch(`https://www.omdbapi.com/?apikey=${APIKEY}&s=${query}`);
        if(!data.ok) throw new Error("NOT FOUND");
        const response=await data.json();
        // console.log(response);
      if(response.Response==='False') throw new Error('Movie Not Found');
        //  console.log(response);
          // setError('');
          setMovies(response.Search)  
          // console.log(response.Search);
    }catch(err){
      if(err.name!=='AbortError'){
        setError(err.message);
      }
     handleBtn();
    }finally{
      setLoading(false)
    }
    }
    if(query.length<1){
      setError('')
      setMovies([])
      return
    }
    FetchMovie();
 },[query])

 function handleDelet(id){
  const newlist = watched.filter(item => item.imdbID !== id)
  setWatched(newlist)
  // console.log(id);
}

function handleMovieClicked(id){
  setSelected(selected=>selected===id?setSelected(null):id);
}
function handleBtn(){
  setSelected(null);
}
function handleAddMovie(mo){
   setWatched(watched=>[...watched,mo])
   setSelected(null)
  // console.log(mo);
}



  return (
    <>
      <NavBar movies={movies} query={query} setQuery={setQuery} backbtn={handleBtn}/>
      <Main>
      <Box>
        {loading && <Loader/>}
        {!loading && !error && <MovieList movies={movies} onMovieclick={handleMovieClicked} />}
        {error && <ErrorMessage message={error}/>}
         {/* {loading?<Loader/>:<MovieList movies={movies}/>} */}
      </Box>
      <Box>
        {selected? <MovieClicked selected={selected} clickBtn={handleBtn} onAddMovie={handleAddMovie} watched={watched}/>:
        <> <WatchedSummary watched={watched}/>
         <WatchedMovieList watched={watched} onDelet={handleDelet}/>  </>}
      </Box>
      
      </Main>
    </>
  );
}
 function MovieClicked({selected,clickBtn,onAddMovie,watched}){
  const [movies,setMovies]=useState({});
  const [isloading ,setIsloading]= useState(false);
  const [userRating,setUserRating]=useState('')
 
  const {Title:title,
    Year:year,
    Poster:poster,
    Runtime:runtime,
    imdbRating,
    Plot:plot,
    Released:released,
    Actors:actor,
    Director:director,
    Genre:genre
  }=movies;
  // console.log(actor);
  const watchedImdbIDs = watched.map(movie => movie.imdbID).includes(selected);
  // console.log(watchedImdbIDs);
  useEffect(function(){
  
    function callBack(e){
      if(e.code==='Escape'){
        clickBtn();
        console.log('closing');
       }
    }
     document.addEventListener('keydown',callBack)
   return function(){
    document.removeEventListener('keydown',callBack)
   }
  },[])

  function handleAddtoList(){
      // clickBtn();
      const newWatchMovies={
        imdbID:selected,
        title,
        year,
        poster,
        userRating,
        imdbRating:Number(imdbRating),
        runtime:Number(runtime.split(" ").at(0)),
      }
     onAddMovie(newWatchMovies);
     
  }
  function handleUserRating(strs){
    setUserRating(strs)
  }

  useEffect(function(){
    async function MovieDetails(){
      setIsloading(true)
      const data= await fetch(`https://www.omdbapi.com/?apikey=${APIKEY}&i=${selected}`);
      const response=await data.json();
      // console.log(response);
      setMovies(response)
      setIsloading(false)
    }
    MovieDetails();
  },[selected])
  useEffect(function(){
    document.title=title
    return function() {document.title='Usepopcorn'};
  },[title])

   return(
    <div className="details">
     { isloading?<Loader/> :<><header>
      <button className="btn-back" onClick={clickBtn}> ←  </button>
       <img src={poster} alt={title}/>
       <div className="details-overview">
        <h2>{title}</h2>
        <p>{released} &bull; {runtime}</p>
        <p>{genre}</p>
        <p>⭐️{imdbRating}</p>
       </div>
      </header>
     
      <section>
        <div className="rating">
       { watchedImdbIDs?<p>You Rated {userRating} ⭐️ </p>:<><StarRatin max={10} size={22}  onStar={handleUserRating}/>
       {userRating>0 && <button className="btn-add" onClick={handleAddtoList}>Add to list</button>}</>}
        </div>
        <p><em>{plot}</em></p>
        <p>Starring {actor}</p>
        <p>Directed bt {director}</p>
      </section></>}
    </div>
   )
 }
function Loader(){
  return(<p className="loader">Loading.....</p>)
}
function ErrorMessage({message}){
  return(
    <p className="error">
      <span>❌</span>{message}
    </p>
  )
}
function NavBar({movies,query,setQuery,backbtn}){
 const inputTag=useRef(null);

 useEffect(function(){
  function handleKeyDown(e){
    // if(document.activeElement===inputTag.current) return
    if(e.code==='Enter'){
      // console.log('okkkkk');
      inputTag.current.focus()
      setQuery('')
      backbtn()
    }
  }
  document.addEventListener('keydown',handleKeyDown);
 },[]);

 
  return(
    <nav className="nav-bar">
        <div className="logo">
          <span role="img">🍿</span>
          <h1>usePopcorn</h1>
        </div>
        <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          ref={inputTag}
        />
        <p className="num-results">
          Found <strong>{movies.length}</strong> results
        
        </p>
      </nav>
  )
}

function Main({children}){

  return(
    <main className="main">
    {children}
  </main>
  )
}

function Box({children}){


  const [isOpen, setIsOpen] = useState(true);

  return(
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  )
}

const APIKEY='9608a144';
function MovieList({movies ,onMovieclick}){

  return(
      <ul className="list list-movies">
        {movies?.map((movie) => <Movies movie={movie} key={movie.imdbID} onMovieclick={onMovieclick} />)}
    </ul>
    )
  
}

function Movies({movie,onMovieclick}){
  return(
    (
      <li onClick={()=>onMovieclick(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
      )
  )
}

// function WatchedBox(){

 
//   const [isOpen2, setIsOpen2] = useState(true);
  
//   return(
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
        
//         </>
//       )}
//     </div>
//   )
// }

function WatchedSummary({watched}){
 
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return(
    <div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating.toFixed(2)}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating.toFixed(2)}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
      </p>
    </div>
  </div>
  )
}

function WatchedMovieList({watched,onDelet}){
  return(
    <ul className="list">
            {watched.map((movie) => (
              <WatcheList movie={movie} key={movie.imdbID} onDelet={onDelet} />
            ))}
          </ul>
  )
}

function WatcheList({movie,onDelet} ){
  
  return(
    <li >
                <img src={movie.poster} alt={`${movie.title} poster`} />
                <h3>{movie.title}</h3>
                <div>
                  <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                  </p>
                  <button onClick={()=>onDelet(movie.imdbID)} className="btn-delete">X</button>
                </div>
              </li>
  )
}