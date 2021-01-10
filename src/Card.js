import React, { useState } from "react";

import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import InfoIcon from "@material-ui/icons/Info";

import { makeStyles } from "@material-ui/core/styles";

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
}));

export default function MovieCard(props) {
  const { updateFavourites, handleModalOpen, movie, nominated } = props;
  const [selected, setSelected] = useState(nominated);

  const selectMovie = (movie) => (e) => {
    if (updateFavourites(movie)) {
      setSelected((prevValue) => !prevValue);
    }
  };

  const classes = useStyles();

  return (
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
            <IconButton
              aria-label="add to favorites"
              onClick={selectMovie(movie)} // TODO: Change this to show animation on adding
            >
              {selected ? (
                <FavoriteIcon fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
            <IconButton
              aria-label="info"
              onClick={handleModalOpen(movie)} // TODO: fix this!
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </CardActions>
        </div>
        <CardMedia
          className={classes.cover}
          image={movie.Poster}
          title={movie.Title}
        />
      </Card>
    </Grid>
  );
}
