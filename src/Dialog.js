import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    // marginLeft: theme.spacing(4),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      {/* <Typography variant="h6">{children}</Typography> */}
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomizedDialogs(props) {
  const { open, plot, handleClose, title, year, rating } = props;
  const imdbRating = parseInt(rating);
  let ratingColor = "FireBrick";
  if (imdbRating) {
    if (imdbRating >= 8) {
      ratingColor = "DarkGreen";
    } else if (imdbRating >= 6) {
      ratingColor = "SteelBlue";
    }
  }

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          <div>
            <Typography variant="h5" display="inline">
              {/* Movie title */}
              {title}
            </Typography>
            <Typography
              variant="overline"
              display="inline"
              style={{ marginLeft: 10 }}
            >
              {/* Movie Year */}
              {year}
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          {plot ? (
            <Typography gutterBottom>{plot}</Typography>
          ) : (
            <span style={{ textAlign: "center" }}>
              <Typography gutterBottom>LOADING</Typography>
            </span>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            disabled
            size="small"
            style={{ color: ratingColor }}
          >
            Rating: {rating}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
