import React from "react";
import ReactDOM from "react-dom";
import Form from "./formGenerationEngine";
import "./styles.css";

var uiSchema = {
  "ui:order": ["*", "file"]
};

const uiSchemaMeta = {
  choose: {
    "ui:widget": "checkboxes"
  }
};

let uiSchemaForm = {
  "ui:order": ["*", "file"]
};

const onMetaSubmit = ({ formData }) => {
  console.log(formData);
  schema.properties = {};
  schema.title = protoschema.title;
  schema.description = protoschema.description;
  schema.type = "object";
  Object.keys(protoschema.properties).forEach(function(key) {
    if (
      formData.choose.indexOf(protoschema.properties[key.toString()].title) > -1
    ) {
      schema.properties[key.toString()] =
        protoschema.properties[key.toString()];
      if (schema.properties[key.toString()].type === "array")
        uiSchema[key.toString()] = JSON.parse('{"ui:widget": "select"}');
    }
  });
  schema.properties.file = {
    type: "string",
    format: "data-url",
    title: "Please upload the request file"
  };
  console.log(JSON.stringify(schema));
  ReactDOM.render(<App2 />, rootElement);
  fetch(
    "https://jmr2oacl0g.execute-api.us-west-1.amazonaws.com/default/forms-upload-schema",
    {
      method: "POST",
      body: JSON.stringify(metaschema)
    }
  )
    .then(res => {
      return res.text();
    })
    .then(myBody => {
      console.log(myBody);
    })
    .catch(console.error);
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
