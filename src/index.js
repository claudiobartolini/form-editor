import React from "react";
import ReactDOM from "react-dom";
import Form from "react-jsonschema-form"; // original
import "./styles.css";

var uiSchema = {
  "ui:order": ["*", "file"]
};

const uiMetaschema = {
  choose: {
    "ui:widget": "checkboxes"
  }
};

const uiTemplateschema = {};

var schema = {};
var protoschema = {};
var metaschema = {};
var templateschema = {};
var templateEntries = {};
var templateKey;

const onTemplateSubmit = ({ formData }) => {
  const selectedEntry = templateEntries.entries.find(template => {
    return template.displayName === formData.choose;
  });
  console.log(formData);

  templateKey = selectedEntry.templateKey;
  fetch(
    "https://o9ab3pyst2.execute-api.us-west-1.amazonaws.com/default/forms",
    {
      method: "POST",
      body: JSON.stringify({
        command: "fetchTemplate",
        pick: selectedEntry.templateKey
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
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
        uiSchema[key.toString()] = JSON.parse('{"ui:widget": "checkboxes"}');
    }
  });
  schema.properties.file = {
    type: "string",
    format: "data-url",
    title: "Please upload the request file"
  };
  schema.templateKey = templateKey;
  console.log(JSON.stringify(schema));
  ReactDOM.render(<App2 />, rootElement);
  fetch(
    "https://jmr2oacl0g.execute-api.us-west-1.amazonaws.com/default/forms-upload-schema",
    {
      method: "POST",
      body: JSON.stringify(schema)
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

const onSubmit = ({ formData }) => {
  alert("Data submitted: ", formData);
  //  when we split in editor + filler app, schema will be
  // available from reading .boxform from file, and it will
  // include the proper templateKey. So it's not cheating
  formData.templateKey = schema.templateKey;
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

function App0() {
  return (
    <div className="BoxForm" id="pickTemplate">
      <Form
        schema={templateschema}
        onSubmit={onTemplateSubmit}
        uiSchema={uiTemplateschema}
      />
    </div>
  );
}

function App1() {
  return (
    <div className="BoxForm" id="createSchema">
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
    <div className="BoxForm" id="fillForm">
      <Form schema={schema} onSubmit={onSubmit} uiSchema={uiSchema} />
    </div>
  );
}

const rootElement = document.getElementById("root");
fetch("https://o9ab3pyst2.execute-api.us-west-1.amazonaws.com/default/forms", {
  method: "POST",
  body: JSON.stringify({ command: "templatesList" }),
  headers: {
    "Content-Type": "application/json"
  }
})
  .then(res => {
    return res.text();
  })
  .then(myBody => {
    console.log(myBody);
    templateEntries = JSON.parse(myBody);
    console.log(JSON.stringify(templateschema));

    // create the metaschema
    templateschema.title = "Select the template from the list";
    templateschema.description = "";
    templateschema.type = "object";
    templateschema.properties = {};
    templateschema.properties.choose = {};
    templateschema.properties.choose.type = "string";
    templateschema.properties.choose.enum = [];
    for (var i in templateEntries.entries) {
      templateschema.properties.choose.enum.push(
        templateEntries.entries[i].displayName
      );
    }
    console.log(JSON.stringify(templateschema));

    ReactDOM.render(<App0 />, rootElement);
  })
  .catch(console.error);
