import React from "react";
import ReactDOM from "react-dom";
import Form from "./formGenerationEngine";
import "./styles.css";

/*
const uiSchema = {
  firstName: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  age: {
    "ui:widget": "updown",
    "ui:title": "Age of person"
  },

  password: {
    "ui:widget": "password",
    "ui:help": "Hint: Make it strong!"
  },
  date: {
    "ui:widget": "alt-datetime"
  },
  telephone: {
    "ui:options": {
      inputType: "tel"
    }
  }
};

*/

var schema = {};
var uiSchema = {};

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
    schema = JSON.parse(myBody);
    schema.properties.file = {
      type: "string",
      format: "data-url",
      title: "Please upload the request file"
    };
    ReactDOM.render(<App />, rootElement);
  })
  .catch(console.error);
