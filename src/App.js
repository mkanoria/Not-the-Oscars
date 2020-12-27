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
import Container from "@material-ui/core/Container";

import CustomizedDialogs from "./Dialog";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
    // flexDirection: "column",
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
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

  useEffect(() => {
    axios
      .get(`http://www.omdbapi.com/?apikey=d80719e6&s=wonder`)
      .then((res) => {
        // console.log(res);
        const results = res.data.Search;
        // console.log(results);
        setMovies(results);
      });
  }, []);

  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="App">
      <SearchAppBar />
      <Container className={classes.cardGrid} maxWidth="md">
        <CustomizedDialogs />
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
                  <CardActions>
                    <div className={classes.controls}>
                      <Button size="small" color="primary">
                        Nominate!
                      </Button>
                    </div>
                  </CardActions>
                  {/* <CardMedia
                    className={classes.cardMedia}
                    image={movie.Poster}
                    title={movie.Title}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h5">
                      {movie.Title}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton aria-label="add to favorites">
                      <FavoriteIcon />
                    </IconButton>
                  </CardActions> */}
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
