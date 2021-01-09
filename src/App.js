import React, { useState, useEffect } from "react";
import axios from "axios";

import SearchAppBar from "./AppBar";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import InfiniteScroll from "react-infinite-scroll-component";
import Typography from "@material-ui/core/Typography";

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
  // State used to handle alert props
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currID, setCurrID] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  // TODO: NEED TO FIX THIS!
  // State used to handle Modal props
  const [open, setOpen] = useState(false); // State to monitor if dialog is open
  const [plot, setPlot] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");

  const fetchMoreData = () => {
    console.log("here");
    setPage((curr) => curr + 1);
  };

  // Search hook
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Validate that there is input
      if (!search) {
        setMovies(myTopMovies);
        setPage(1);
        setHasMore(false);
        return;
      }
      // Send Axios request here
      axios
        .get(`http://www.omdbapi.com/?apikey=d80719e6&s=${search}&page=${page}`)
        .then((res) => {
          // Check if response exists
          if (res.data.Response === "False") {
            // If response does not exist, set list of movies to default
            setMovies(myTopMovies);
            setPage(1);
            setHasMore(false);
            // Show alert with `no results found`
            setAlertMessage(`No results found for ${search}`);
            setShowAlert(true);
            return;
          }
          // Calculate page number
          const totalSearchResults = res.data.totalResults;
          const totalPages = Math.floor(totalSearchResults / 10);
          // Set `hasMore` to true if there are more pages to parse
          if (page === totalPages) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          const results = res.data.Search;
          if (page === 1) {
            // This removes the `topMovies` from the list
            setMovies(results);
          } else {
            // If this is not the first page, append to movies list
            setMovies((old) => [...old, ...results]);
          }
        });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, search]);

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

  useEffect(() => {
    // Show alert with `no results found`
    setAlertMessage(
      `To start, here are some of my favourite movies of 2020 🍿`
    );
    setShowAlert(true);
  }, []);

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
      <InfiniteScroll
        dataLength={movies.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <p style={{ textAlign: "center" }}>
            <Typography component="h5" variant="h5">
              Loading! 👀
            </Typography>
          </p>
        }
        endMessage={
          page === 1 ? (
            ""
          ) : (
            <p style={{ textAlign: "center" }}>
              <Typography variant="button" display="block">
                No more results found 😞
              </Typography>
            </p>
          )
        }
      >
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
      </InfiniteScroll>
    </div>
  );
}

export default App;
