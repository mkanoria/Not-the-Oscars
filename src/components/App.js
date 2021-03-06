import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Alert from "./Alert";
import SearchAppBar from "./AppBar";
import MovieCard from "./MovieCard";
import InfoDialog from "./Dialog";
import useStateWithLocalStorage from "../utilities/localStorageHook";
import NominationHeading from "./NominationHeading";
import { myTopMovies } from "../utilities/myTopMovies";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  center: {
    margin: "auto",
  },
}));

export default function App() {
  const [favourites, setFavourites] = useState([]);
  const [showFavourites, setShowFavourites] = useState(false);
  const [movies, setMovies] = useState([]);
  // State used to handle alert props
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  // State used to handle Modal props
  const [currID, setCurrID] = useState("");
  const [open, setOpen] = useState(false); // State to monitor if dialog is open
  const [plot, setPlot] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");

  const classes = useStyles();
  // localStore -> []
  const [localStore, setLocalStore] = useStateWithLocalStorage("favourites");

  // Fetch More Data for infinite scrolling
  const fetchMoreData = () => {
    setPage((curr) => curr + 1);
  };

  // Change current movies displayed to favourites
  useEffect(() => {
    if (showFavourites) {
      setMovies(favourites);
    }
  }, [showFavourites, favourites]);

  // Search hook
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Validate that there is input
      if (!search) {
        setMovies(myTopMovies);
        setSearching(false);
        setPage(1);
        setHasMore(false);
        return;
      }
      // Send Axios request here
      axios
        .get(
          `https://www.omdbapi.com/?apikey=d80719e6&s=${search}&page=${page}`
        )
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
          if (searching) {
            if (page === 1) {
              // This removes the `topMovies` from the list
              setMovies(results);
            } else {
              // If this is not the first page, append to movies list
              setMovies((old) => [...old, ...results]);
            }
          }
        });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, search, searching]);

  // Hook to get movie details if modal opened
  useEffect(() => {
    async function fetchMoviePlot() {
      axios
        .get(`https://www.omdbapi.com/?apikey=d80719e6&plot=full&i=${currID}`)
        .then((res) => {
          const result = res.data.Plot;
          setPlot(result);
          setRating(res.data.imdbRating);
        });
    }
    if (open && currID) {
      fetchMoviePlot();
    }
  }, [open, currID]);

  // Initial welcome hook
  useEffect(() => {
    setAlertMessage(
      `To start, here are some of my favourite movies of 2020 🍿`
    );
    setShowAlert(true);
  }, []);

  useEffect(() => {
    if (localStore) {
      setFavourites(localStore);
    }
  }, [localStore]);

  const updateFavourites = (movie) => {
    // Remove from favourites if it already exists
    if (favourites.some((fav) => fav.imdbID === movie.imdbID)) {
      // Same ID found
      setFavourites(favourites.filter((fav) => fav.imdbID !== movie.imdbID));
      setLocalStore(localStore.filter((fav) => fav.imdbID !== movie.imdbID)); // Remove from local storage
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
    setFavourites((original) => [...original, movie]);
    setLocalStore((original) => [...original, movie]); // Store values in localStorage
    return true;
  };

  const handleModalOpen = (movie) => (e) => {
    setCurrID(movie.imdbID);
    setTitle(movie.Title);
    setYear(movie.Year);
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
        favourites={favourites}
        setMovies={setMovies}
        setSearching={setSearching}
        setPage={setPage}
        setShowFavourites={setShowFavourites}
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
          searching && (
            <span style={{ textAlign: "center", paddingBottom: 3 }}>
              <Typography component="h5" variant="h5">
                Loading! 👀
              </Typography>
            </span>
          )
        }
        endMessage={
          !searching ? (
            ""
          ) : (
            <span style={{ textAlign: "center" }}>
              <Typography variant="button" display="block">
                No more results found 😞
              </Typography>
            </span>
          )
        }
      >
        <Container className={classes.cardGrid} maxWidth="md">
          {showFavourites && <NominationHeading favourites={favourites} />}
          <InfoDialog
            handleClose={handleClose}
            open={open}
            plot={plot}
            year={year}
            title={title}
            rating={rating}
          />
          <Grid container spacing={2}>
            {movies.map((movie) => {
              let nominated = false;
              if (favourites.some((fav) => fav.imdbID === movie.imdbID)) {
                nominated = true;
              }
              return (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  handleModalOpen={handleModalOpen}
                  updateFavourites={updateFavourites}
                  nominated={nominated}
                />
              );
            })}
          </Grid>
        </Container>
      </InfiniteScroll>
    </div>
  );
}
