import React, { useState, useEffect } from "react";
import axios from "axios";

import SearchAppBar from "./AppBar";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import CustomizedDialogs from "./Dialog";
import MovieCard from "./Card";
import Alert from "./Alert";
import { myTopMovies } from "./topMovies";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  center: {
    margin: "auto",
  },
}));

function App() {
  const [favourites, setFavourites] = useState([]);
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false); // State to monitor if dialog is open
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currID, setCurrID] = useState("");
  const [search, setSearch] = useState(""); // TODO: Can do better
  const [page, setPage] = useState();
  // TODO: NEED TO FIX THIS!
  const [plot, setPlot] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");

  // Search hook
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(search);
      if (!search) {
        setMovies(myTopMovies);
        return;
      }
      // Send Axios request here
      axios
        .get(`http://www.omdbapi.com/?apikey=d80719e6&s=${search}`)
        .then((res) => {
          // Check if response exists
          if (res.data.Response === "False") {
            // If response does not exist, set list of movies to default
            setMovies(myTopMovies);
            setAlertMessage(`No results found for ${search}`);
            setShowAlert(true);
            return;
          }
          // Calculate page number
          const numberOfResults = res.data.totalResults;
          setPage(Math.floor(numberOfResults / 10));
          const results = res.data.Search;
          setMovies((old) => [...old, ...results]);
        });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Hook to get movie details if modal opened
  useEffect(() => {
    async function fetchMoviePlot() {
      axios
        .get(`http://www.omdbapi.com/?apikey=d80719e6&plot=full&i=${currID}`)
        // .get(`http://www.omdbapi.com/?apikey=d80719e6&plot=full&i=tt0451279`)
        .then((res) => {
          console.log(res);
          const result = res.data.Plot;
          setPlot(result);
        });
    }
    if (open && currID) {
      fetchMoviePlot();
    }
  }, [open, currID]);

  const classes = useStyles();

  const updateFavourites = (imdbID, title, year) => {
    // Remove from favourites if it already exists
    if (favourites.some((fav) => fav.imdbID === imdbID)) {
      // Same ID found
      setFavourites(favourites.filter((fav) => fav.imdbID !== imdbID));
      return true;
    }
    // Check for size
    if (favourites.length === 4) {
      // When the fifth movie is being added, favourites has 4 elements
      setAlertMessage("5 Movies Nominated!");
      setShowAlert(true);
    } else if (favourites.length === 5) {
      // Open popup showing 5 movies selected
      setAlertMessage("5 Movies Nominated!");
      setShowAlert(true);
      // Don't update the list of favourites
      return false;
    }
    setFavourites((original) => [
      ...original,
      { imdbID: imdbID, title: title, year: year },
    ]);
    return true;
  };

  const handleModalOpen = (imdbID, title, year) => (e) => {
    // console.log("Movie id is ", e.target.value);
    setCurrID(imdbID);
    setTitle(title);
    setYear(year);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPlot("");
    setCurrID("");
  };

  return (
    <div className="App">
      <SearchAppBar
        setSearch={setSearch}
        setMovies={setMovies}
        favourites={favourites}
      />
      <Alert
        message={alertMessage}
        setMessage={setAlertMessage}
        show={showAlert}
        setShow={setShowAlert}
      />
      <Container className={classes.cardGrid} maxWidth="md">
        <CustomizedDialogs
          handleClose={handleClose}
          open={open}
          plot={plot}
          year={year}
          title={title}
        />
        <Grid container spacing={2}>
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              handleModalOpen={handleModalOpen}
              updateFavourites={updateFavourites}
            />
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
