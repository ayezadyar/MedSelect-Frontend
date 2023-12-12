import React from "react";
import './index.css';

function InputControl(props) {
  return (
    <div className="mb-4"> {/* Add margin-bottom for spacing between fields */}
      {props.label && <label className="block text-gray-700 text-sm font-bold mb-2">{props.label}</label>}
      <input
        className=""
        type="text"
        {...props}
      />
    </div>
  );
}

export default InputControl;
