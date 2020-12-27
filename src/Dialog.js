import React, { useState, useEffect } from "react";
import axios from "axios";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
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

export default function CustomizedDialogs() {
  const [open, setOpen] = useState(false);
  const [plot, setPlot] = useState("");

  useEffect(() => {
    axios
      .get(`http://www.omdbapi.com/?apikey=d80719e6&i=tt0451279&plot=full`)
      .then((res) => {
        console.log(res);
        const result = res.data.Plot;
        setPlot(result);
      });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open dialog
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          <div>
            <Typography variant="h5" display="inline">
              {/* Movie title */}
              Wonder Woman
            </Typography>
            <Typography
              variant="overline"
              display="inline"
              style={{ marginLeft: 10 }}
            >
              {/* Movie Year */}
              2017
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>{plot}</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Nominate!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

{
  /* <Button
  variant="outlined"
  color="secondary"
  disabled
  size="small"
  style={{ color: "red" }}
>
  2017
</Button>; */
}
