import React from "react";
import { DEFAULT_COLOR_LIST } from "../ENUM";

function DefaultColorList({ onChange }) {
  return (
    <div className="default-color-list">
      <p className="info">选择渐变颜色</p>
      <ul>
        {DEFAULT_COLOR_LIST.map((color) => (
          <li
            key={color}
            style={{ background: color }}
            className={`${color ? "" : "empty"}`}
            onClick={() => onChange(color)}
          ></li>
        ))}
      </ul>
    </div>
  );
}
export default DefaultColorList;
