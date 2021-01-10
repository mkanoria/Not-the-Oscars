import React from "react";
import Typography from "@material-ui/core/Typography";

export default function NominationHeading(props) {
  const { favourites } = props;

  return (
    <span style={{ textAlign: "center", paddingBottom: 2 }}>
      {favourites.length ? (
        <Typography component="h4" variant="h4">
          Your Nominations
        </Typography>
      ) : (
        <Typography component="h4" variant="h4">
          No movies nominated, get started by searching!
        </Typography>
      )}
    </span>
  );
}
