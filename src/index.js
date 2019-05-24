import React from "react";
import ReactDOM from "react-dom";
import Form from "./formGenerationEngine";
import "./styles.css";

const schema = {
  title: "A registration form",
  description: "A simple form example.",
  type: "object",
  required: ["firstName", "lastName"],
  properties: {
    firstName: {
      type: "string",
      title: "First name",
      default: "Chuck"
    },
    lastName: {
      type: "string",
      title: "Last name"
    },
    age: {
      type: "integer",
      title: "Age"
    },
    bio: {
      type: "string",
      title: "Bio"
    },
    password: {
      type: "string",
      title: "Password",
      minLength: 3
    },
    telephone: {
      type: "string",
      title: "Telephone",
      minLength: 10
    }
  }
};

const uiSchema = {
  firstName: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  age: {
    "ui:widget": "updown",
    "ui:title": "Age of person",
    "ui:description": "(earthian year)"
  },
  bio: {
    "ui:widget": "textarea"
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
  return <Form schema={schema} onSubmit={onSubmit} uiSchema={uiSchema} />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
