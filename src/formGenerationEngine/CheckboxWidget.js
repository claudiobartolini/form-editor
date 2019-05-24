import React from "react";
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox as MCheckbox
} from "@material-ui/core";
import { getError } from "./utils";

const CheckboxWidget = props => {
  const { id, required, schema, value, onChange, rawErrors } = props;
  // console.log("c", value);
  return (
    <FormControl
      disabled={schema.disabled}
      required={required}
      error={!!(rawErrors && rawErrors.length)}
      style={{ width: "100%" }}
    >
      <FormGroup>
        <FormControlLabel
          control={
            <MCheckbox
              id={id}
              checked={value}
              onChange={event => onChange(event.target.checked)}
              value={schema.title}
            />
          }
          label={schema.title}
        />
      </FormGroup>
      {getError(rawErrors)}
    </FormControl>
  );
};

export default CheckboxWidget;
