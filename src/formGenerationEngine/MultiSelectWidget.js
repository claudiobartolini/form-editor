import React from "react";
import { FormLabel } from "@material-ui/core";
import ReactSelect from "react-select";
import { getError } from "./utils";

const isOptionSelected = (currentItem, allSelected) => {
  // console.log(currentItem, allSelected);
  return allSelected.includes(currentItem.value);
  // map(a => a.value)
};

const getSelectedValue = (value, options) => {
  // console.log("RECALCULATING");
  return value && value.map(v => options.find(o => o.value === v));
};

const modifyChangeValue = value => {
  console.log("v", value);
  if (!value.length) {
    return null;
  }
  return value.map(a => a.value);
};

const MultiSelectWidget = props => {
  const { id, required, schema, value, onChange, rawErrors, options } = props;
  return (
    <div>
      <FormLabel style={{ fontSize: 12, marginBottom: 10 }} component="legend">
        {schema.title}
        {required ? "*" : null}
      </FormLabel>
      <ReactSelect
        isDisabled={schema.disabled}
        id={id}
        placeholder={schema.title}
        isMulti
        name={schema.title}
        options={options.enumOptions}
        value={getSelectedValue(value, options.enumOptions)}
        isOptionSelected={isOptionSelected}
        onChange={value => {
          onChange(modifyChangeValue(value));
        }}
      />
      {getError(rawErrors)}
    </div>
  );
};

export default MultiSelectWidget;
