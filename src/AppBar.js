import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Badge from "@material-ui/core/Badge";
import LocalActivityRoundedIcon from "@material-ui/icons/LocalActivityRounded";
import { myTopMovies } from "./topMovies";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function SearchAppBar(props) {
  const classes = useStyles();

  const handleBack = () => {
    setMovies(myTopMovies);
    setShowFavourites(false);
  };

  const { favourites, setSearch, setMovies, setShowFavourites } = props;

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#64943E" }}>
        <Toolbar>
          <Link
            className={classes.title}
            href="#"
            onClick={handleBack}
            color="inherit"
          >
            <Typography className={classes.title} variant="h4" noWrap>
              The Shoppies
            </Typography>
          </Link>
          <IconButton
            aria-label="cart"
            onClick={() => {
              setShowFavourites((curr) => {
                if (curr) {
                  setMovies(myTopMovies);
                }
                return !curr;
              });
            }}
          >
            <Badge badgeContent={favourites.length} color="primary">
              <LocalActivityRoundedIcon
                style={{
                  color: favourites.length === 0 ? "inherit" : "white",
                  fontSize: 30,
                }}
                disabled={true}
              />
            </Badge>
          </IconButton>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search!"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default SearchAppBar;
