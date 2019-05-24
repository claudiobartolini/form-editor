import React from "react";
import {
  FormControl,
  InputLabel,
  Select as MSelect,
  MenuItem,
  Input as MInput
} from "@material-ui/core";
import { getError } from "./utils";
import MultiSelectWidget from "./MultiSelectWidget";
import AutocompleteWidget from "./AutocompleteWidget";

// TODO: We can even add start and end adornments in the second phase
const SelectWidget = props => {
  const { id, required, schema, value, onChange, rawErrors, options } = props;

  if (schema.type === "array") {
    // return <MultiSelectWidget {...props} />;
    return <AutocompleteWidget {...props} />;
  }

  return (
    <FormControl
      disabled={schema.disabled}
      required={required}
      error={!!(rawErrors && rawErrors.length)}
      style={{ width: "100%" }}
    >
      <InputLabel style={{ fontSize: 12 }} htmlFor={`${schema.title}-helper`}>
        {schema.title}
      </InputLabel>
      <MSelect
        id={id}
        style={{ fontSize: 14 }}
        value={value || ""}
        onChange={event => onChange(event.target.value)}
        name={schema.title}
        input={<MInput name={schema.title} id={`${schema.title}-helper`} />}
        MenuProps={{
          style: {
            fontSize: 12
          }
        }}
      >
        {options &&
          options.enumOptions.map(o => (
            <MenuItem
              key={o.value}
              value={o.value}
              style={{
                fontSize: 12,
                padding: "0 16px"
              }}
            >
              {o.label}
            </MenuItem>
          ))}
      </MSelect>
      {getError(rawErrors)}
    </FormControl>
  );
};

export default SelectWidget;
