import React from "react";
import InputNumber from "./InputNumber";

function GradientType({ gradientType, onChangeGradientType, linearDeg, onChangeDeg }) {
  return (<div className="gradient-type-container">
  <div className="gradient-type">
    {["linear", "radial"].map((type) => (
      <input
        type="radio"
        className={`gradient-type-btn ${type} ${
          type === gradientType ? "active" : ""
        }`}
        onClick={() => onChangeGradientType(type)}
        key={type}
      />
    ))}
  </div>
  {gradientType === "linear" && (
    <div className="gradient-linear-deg">
      <InputNumber
        value={parseFloat(linearDeg)}
        onChange={onChangeDeg}
      />
    </div>
  )}
</div>);
}
export default GradientType;
