import React, { Component } from "react";
import Downshift from "downshift";
import {
  Paper,
  Popper,
  TextField,
  MenuItem,
  FormHelperText
} from "@material-ui/core";

class Autocomplete extends Component {
  popperNode = null;
  handleStateChange = changes => {
    const { onChange } = this.props;
    if (changes.hasOwnProperty("selectedItem")) {
      onChange(changes.selectedItem.value);
    } else if (changes.hasOwnProperty("inputValue")) {
      onChange(changes.inputValue);
    }
  };
  getError = errors => {
    if (errors) {
      return errors.map(info => (
        <FormHelperText style={{ color: "red", fontSize: 12 }} key={info}>
          {info}
        </FormHelperText>
      ));
    }
    return null;
  };
  // itemToString = item => (item ? item.label : "");
  render() {
    // const { id, required, schema, value, onChange, rawErrors, options } = props;
    const {
      id,
      required,
      schema,
      value,
      rawErrors,
      options,
      suggestionComponent = item => <span>{item.label}</span>,
      isItemSelected = (selectedItem, suggestion) => {
        if (typeof selectedItem === "object") {
          return selectedItem.value === suggestion.value;
        } else {
          return selectedItem === suggestion.value;
        }
      }
    } = this.props;
    const suggestions = options.enumOptions;
    const placeholder = `${schema.title}${required ? "*" : ""}`;
    console.log(this.props);
    console.log(suggestions, placeholder, isItemSelected, suggestionComponent);
    return (
      // <div>
      //   <Downshift
      //     selectedItem={value}
      //     onStateChange={this.handleStateChange}
      //     // itemToString={this.itemToString}
      //   >
      //     {({
      //       getLabelProps,
      //       getInputProps,
      //       getItemProps,
      //       getMenuProps,
      //       highlightedIndex,
      //       // inputValue,
      //       isOpen,
      //       selectedItem
      //     }) => (
      //       <div>
      //         {/* For accessibility */}
      //         <label {...getLabelProps({ style: { display: "none" } })}>
      //           {placeholder}
      //         </label>
      //         {renderInput({
      //           fullWidth: true,
      //           InputProps: getInputProps({
      //             placeholder,
      //             id
      //           }),
      //           ref: node => {
      //             this.popperNode = node;
      //           },
      //           autoComplete: "nope"
      //         })}
      //         <Popper open={isOpen} anchorEl={this.popperNode}>
      //           <div
      //             {...(isOpen
      //               ? getMenuProps({}, { suppressRefError: true })
      //               : {})}
      //           >
      //             <Paper
      //               square
      //               style={{
      //                 marginTop: 8,
      //                 width: this.popperNode
      //                   ? this.popperNode.clientWidth
      //                   : null
      //               }}
      //             >
      //               {suggestions &&
      //                 suggestions.map((suggestion, index) =>
      //                   renderSuggestion({
      //                     suggestion,
      //                     index,
      //                     itemProps: getItemProps({ item: suggestion }),
      //                     highlightedIndex,
      //                     selectedItem,
      //                     suggestionComponent,
      //                     isItemSelected
      //                   })
      //                 )}
      //             </Paper>
      //           </div>
      //         </Popper>
      //       </div>
      //     )}
      //   </Downshift>
      //   {this.getError(rawErrors)}
      // </div>
      null
    );
  }
}

export default Autocomplete;

function renderInput(inputProps) {
  const { InputProps, ref, style = {}, ...other } = inputProps;
  return (
    <TextField
      InputProps={{
        inputRef: ref,
        ...InputProps,
        style: {
          fontSize: 14,
          ...style
        }
      }}
      {...other}
    />
  );
}
function renderSuggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem,
  suggestionComponent,
  isItemSelected
}) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = isItemSelected(selectedItem, suggestion); // (selectedItem || "").indexOf(suggestion.label) > -1;
  const SuggestionComponent = suggestionComponent;
  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      <SuggestionComponent suggestion={suggestion} />
    </MenuItem>
  );
}
