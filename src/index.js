import React from "react";
import ReactDOM from "react-dom";
import Form from "./formGenerationEngine";
import "./styles.css";

const rootElement = document.getElementById("root");

const uiSchemaForm = {
  "ui:order": ["*", "file"]
};

const uiSchemaMeta = {
  choose: {
    "ui:widget": "checkboxes"
  }
};

let protoschema = {};
let metaschema = {};
let schema = {};

const onSubmitMeta = ({ formData }) => {
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

  console.log(schema);
  ReactDOM.render(<FormUploader />, rootElement);
};

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

function FormBuilder() {
  return (
    <div className="app" id="createSchema">
      <Form
        schema={metaschema}
        onSubmit={onSubmitMeta}
        uiSchema={uiSchemaMeta}
      />
    </div>
  );
}

function FormUploader() {
  return (
    <div className="app" id="fillForm">
      <Form schema={schema} onSubmit={onSubmit} uiSchema={uiSchemaForm} />
    </div>
  );
}

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

    console.log(protoschema);

    // Create the metaschema
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

    console.log(metaschema);

    ReactDOM.render(<FormBuilder />, rootElement);
  })
  .catch(console.error);
