import React from "react";
import ReactDOM from "react-dom";
import Form from "./formGenerationEngine";
import "./styles.css";

const uiSchema = {
  "ui:order": ["*", "file"]
};

const uiMetaschema = {
  choose: {
    "ui:widget": "checkboxes"
  }
};

var schema = {};
var protoschema = {};
var metaschema = {};

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
    }
  });
  schema.properties.file = {
    type: "string",
    format: "data-url",
    title: "Please upload the request file"
  };
  console.log(schema);
  ReactDOM.render(<App2 />, rootElement);
};

const onSubmit = ({ formData }) => {
  alert("Data submitted: ", formData);
  console.log(formData);
  var payload = {
    command: "form",
    body: formData
  };
  fetch(
    "https://fvtwd1iix2.execute-api.us-west-1.amazonaws.com/default/box-forms",
    {
      method: "POST",
      body: JSON.stringify(formData)
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

function App1() {
  return (
    <div className="app" id="createSchema">
      <Form
        schema={metaschema}
        onSubmit={onMetaSubmit}
        uiSchema={uiMetaschema}
      />
    </div>
  );
}

function App2() {
  return (
    <div className="app" id="fillForm">
      <Form schema={schema} onSubmit={onSubmit} uiSchema={uiSchema} />
    </div>
  );
}

const rootElement = document.getElementById("root");
fetch("https://o9ab3pyst2.execute-api.us-west-1.amazonaws.com/default/forms", {
  method: "POST",
  body: JSON.stringify({}),
  headers: {
    "Content-Type": "application/json"
  }
})
  .then(res => {
    return res.text();
  })
  .then(myBody => {
    console.log(myBody);
    protoschema = JSON.parse(myBody);

    // create the metaschema
    metaschema.title = "Select fields from the template";
    metaschema.description = "";
    metaschema.type = "object";
    metaschema.properties = {};
    metaschema.properties.choose = {};
    metaschema.properties.choose.type = "array";
    metaschema.properties.choose.items = {};
    metaschema.properties.choose.items.type = "string";
    metaschema.properties.choose.items.enum = [];
    for (var i in protoschema.properties) {
      metaschema.properties.choose.items.enum.push(
        protoschema.properties[i].title
      );
    }
    metaschema.properties.choose.uniqueItems = true;
    console.log(JSON.stringify(metaschema));

    ReactDOM.render(<App1 />, rootElement);
  })
  .catch(console.error);
