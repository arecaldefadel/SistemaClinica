import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";

function Select({
  title,
  name,
  items = [],
  config = {
    descripCol: "",
    idCol: "",
  },
  value,
  as,
  className = "",
  classLabel = "",
  placeholder = "",
  showPlaceholder = true,
  onChange = () => {},
  requiredInput = false,
  disabled = false,
}) {
  const [selected, setSelected] = useState(value);
  const rowDirection = as?.render?.displayName === "Row";
  const handleChange = (e) => {
    setSelected(e.target.value);
    onChange(e);
  };


  useEffect(() => {
    setSelected(value);
  }, [value]);


  const options = items.map((item) => {
    return (
      <option
        key={item[config.idCol] || item.value}
        value={item[config.idCol] || item.value}>
        {item[config.descripCol] || item.name}
      </option>
    );
  });

  return (
    <Form.Group as={as} controlId="formPlaintext">
      {title ? (
        <Form.Label
          // column
          className={`${classLabel} ${rowDirection ? "col-sm-4" : ""}`}>
          {title}
        </Form.Label>
      ) : (
        ""
      )}
      {requiredInput && (
        <span className="text-danger">
          <strong> * </strong>
        </span>
      )}
      <div className={`${className} ${rowDirection ? "col-sm-8" : ""}`}>
        <Form.Select
          id={name}
          name={name}
          onChange={handleChange}
          value={selected}
          className={className ?? `mb-3`}
          disabled={disabled}
          requerido={requiredInput.toString()}>
          {showPlaceholder && (
            <option value="">
              {placeholder === "" ? "Seleccionar..." : placeholder}
            </option>
          )}
          {options}
        </Form.Select>
      </div>
    </Form.Group>
  );
}

export default Select;
