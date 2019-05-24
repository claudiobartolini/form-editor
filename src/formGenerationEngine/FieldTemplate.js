import React from "react";

function FieldTemplate(props) {
  const { classNames, description, children } = props;
  return (
    <div className={classNames}>
      {description}
      {children}
    </div>
  );
}

export default FieldTemplate;
