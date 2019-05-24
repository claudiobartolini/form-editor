import React from "react";
import ReactDOM from "react-dom";
import Form from "./formGenerationEngine";
import Box from "box-node-sdk";
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

var sdk = new Box({
  clientID: "f20ggsaremy1p6t6u5johupez4aj1usc",
  clientSecret: "oprsKPGZq75Zz6DXGyh2vc2abdDZiYm8"
});

var client = sdk.getBasicClient("6LUynSjOaGkCAv0cUYM8ZUK2Y2byCI8e");

const onSubmit = ({ formData }) => {
  alert("Data submitted: ", formData);
  console.log(formData);
  var folderID = 0;
  client.files
    .uploadFile(folderID, "filledForm.json", formData, options)
    .then(file => {
      console.log("success");
    })
    .catch(err => {
      console.log("error" + err.message);
    });
};

function App() {
  return <Form schema={schema} onSubmit={onSubmit} uiSchema={uiSchema} />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
