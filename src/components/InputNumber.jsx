import React from "react";
import { getRangeValue } from "../util";

function InputNumber({ value, onChange, min, max }) {
  const onInputChange = (val) => {
    const number = getRangeValue(val, min, max);
    onChange && onChange(number);
  };

  return (
    <div className="input-number-container">
      <input value={value} onChange={(e) => onInputChange(e.target.value)} />
      <div className="btn-group">
        <div
          className="btn-add btn-item"
          onClick={() => onInputChange(value + 1)}
        >
          <svg
            viewBox="0 0 20 20"
            className="Polaris-Icon__Svg_375hu"
            focusable="false"
            aria-hidden="true"
          >
            <path d="m15 12-5-5-5 5h10z"></path>
          </svg>
        </div>
        <div
          className="btn-min btn-item"
          onClick={() => onInputChange(value - 1)}
        >
          <svg
            viewBox="0 0 20 20"
            className="Polaris-Icon__Svg_375hu"
            focusable="false"
            aria-hidden="true"
          >
            <path d="m5 8 5 5 5-5H5z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
export default InputNumber;
