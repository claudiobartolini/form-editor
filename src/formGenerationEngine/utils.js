import React from "react";
import { FormHelperText } from "@material-ui/core";

export const getError = errors => {
  if (errors) {
    return errors.map(info => (
      <FormHelperText
        style={{ color: "red", fontSize: 12, marginTop: 0, marginBottom: 8 }}
        key={info}
      >
        {info}
      </FormHelperText>
    ));
  }
  return null;
};
