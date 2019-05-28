import React from "react";
import ReactDOM from "react-dom";
import Form from "./formGenerationEngine";
import "./styles.css";

const rootElement = document.getElementById("root");

const uiSchemaMeta = {
  choose: {
    "ui:widget": "checkboxes"
  }
};

let uiSchemaForm = {
  "ui:order": ["*", "file"]
};

let protoschema = {};
let metaschema = {};
let schema = {};

const onSubmitMeta = ({ formData }) => {
  // Generate schema from selected metadata
  const selectedMetadata = Object.keys(protoschema.properties).reduce(
    (props, key) => {
      return formData.choose.includes(protoschema.properties[key].title)
        ? {
            ...props,
            [key]: protoschema.properties[key]
          }
        : props;
    },
    {}
  );

  schema = {
    description: protoschema.description,
    properties: {
      ...selectedMetadata,
      file: {
        type: "string",
        format: "data-url",
        title: "Please upload the request file"
      }
    },
    title: protoschema.title,
    type: "object"
  };

  // Set "array" type options to display as checkboxes
  const uiSchemaAdditions = Object.keys(selectedMetadata).reduce(
    (props, key) => {
      return selectedMetadata[key].type === "array"
        ? {
            ...props,
            [key]: {
              "ui:widget": "checkboxes"
            }
          }
        : props;
    },
    {}
  );

  uiSchemaForm = {
    ...uiSchemaForm,
    ...uiSchemaAdditions
  };

  ReactDOM.render(<FormUploader />, rootElement);
};

const FormBuilder = () => (
  <div className="app" id="createSchema">
    <Form schema={metaschema} onSubmit={onSubmitMeta} uiSchema={uiSchemaMeta} />
  </div>
);

const onSubmit = ({ formData }) => {
  alert("Data submitted: ", formData);
  console.log(formData);
  fetch(
    "https://fvtwd1iix2.execute-api.us-west-1.amazonaws.com/default/box-forms",
    {
      method: "POST",
      body: JSON.stringify(formData)
    }
  )
    .then(res => res.text())
    .then(responseBody => console.log(responseBody))
    .catch(console.error);
};

const FormUploader = () => (
  <div className="app" id="fillForm">
    <Form schema={schema} onSubmit={onSubmit} uiSchema={uiSchemaForm} />
  </div>
);

// Fetch the metadata template
fetch("https://o9ab3pyst2.execute-api.us-west-1.amazonaws.com/default/forms", {
  method: "POST",
  body: JSON.stringify({}),
  headers: {
    "Content-Type": "application/json"
  }
})
  .then(res => res.text())
  .then(responseBody => {
    protoschema = JSON.parse(responseBody);

    // Create the schema for metadata selector
    metaschema = {
      title: "Select fields from the template",
      description: "",
      type: "object",
      properties: {
        choose: {
          type: "array",
          items: {
            type: "string",
            enum: Object.values(protoschema.properties).map(prop => prop.title)
          },
          uniqueItems: true
        }
      }
    };

    ReactDOM.render(<FormBuilder />, rootElement);
  })
  .catch(console.error);
