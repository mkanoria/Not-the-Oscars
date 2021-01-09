import React, { useState, useEffect } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import SearchAppBar from "./AppBar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import InfoIcon from "@material-ui/icons/Info";
import Container from "@material-ui/core/Container";

import CustomizedDialogs from "./Dialog";
import { myTopMovies } from "./topMovies";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
    // flexDirection: "column",
  },
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
    // flexGrow: 1,
  },
  cover: {
    width: 151,
    marginLeft: "auto",
    // width: "100%",
    // height: 0,
    // paddingLeft: "80.25%",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

function App() {
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false); // State to monitor if dialog is open
  const [currID, setCurrID] = useState("");
  const [search, setSearch] = useState(""); // TODO: Can do better
  // TODO: NEED TO FIX THIS!
  const [plot, setPlot] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");

  // Search hook?
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
            return;
          }
          const results = res.data.Search;
          // console.log(results);
          setMovies(results);
        });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Hook to get movie plot if modal opened
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

  const handleOpen = (imdbID, title, year) => (e) => {
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
      <SearchAppBar setSearch={setSearch} setMovies={setMovies} />
      <Container className={classes.cardGrid} maxWidth="md">
        {/* <Button variant="outlined" color="primary" onClick={handleOpen}>
          Open dialog
        </Button> */}
        <CustomizedDialogs
          handleClose={handleClose}
          open={open}
          plot={plot}
          year={year}
          title={title}
        />
        <Grid container spacing={2}>
          {movies.map((movie) => (
            <Grid item key={movie.imdbID} xs={12} sm={6} md={4}>
              <Card className={classes.root}>
                <div className={classes.details}>
                  <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                      {movie.Title}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {movie.Year}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <FavoriteIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label="share"
                      onClick={handleOpen(
                        movie.imdbID,
                        movie.Title,
                        movie.Year
                      )} // TODO: fix this!
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </div>
                <CardMedia
                  className={classes.cover}
                  image={movie.Poster}
                  // image="https://source.unsplash.com/random"
                  title={movie.Title}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
