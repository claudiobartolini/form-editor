import React from "react";
import ReactDOM from "react-dom";
import Form from "./formGenerationEngine";
import "./styles.css";

const uiSchema = {
  "ui:order": ["choose", "*", "file"],
  choose: {
    "ui:widget": "checkboxes"
  }
};

var schema = {};
var protoschema = {};
var metaschema = {};

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
    .then(res => {
      return res.text();
    })
    .then(myBody => {
      console.log(myBody);
    })
    .catch(console.error);
};

function App() {
  return (
    <div className="app">
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
    metaschema.properties = {};
    metaschema.properties.choose = {};
    metaschema.properties.choose.type = "array";
    metaschema.properties.choose.title =
      "Select fields from the " + protoschema.title + " template";
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

    schema = protoschema;
    schema.properties.choose = metaschema.properties.choose;
    schema.properties.file = {
      type: "string",
      format: "data-url",
      title: "Please upload the request file"
    };
    ReactDOM.render(<App />, rootElement);
  })
  .catch(console.error);
