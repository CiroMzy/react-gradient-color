import React from "react";
import { DEFAULT_COLOR_LIST } from "../ENUM";

function ColorStop({ onAdd, onSubstruction }) {
  return (<div className="gradient-line">
  <span>颜色停止点：</span>
  <div className="gradient-stop-container">
    <button onClick={onAdd}>
      <span>
        <svg
          viewBox="0 0 20 20"
          className="Polaris-Icon__Svg_375hu"
          focusable="false"
          aria-hidden="true"
        >
          <path d="M17 9h-6V3a1 1 0 1 0-2 0v6H3a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2z"></path>
        </svg>
      </span>
    </button>
    <button onClick={onSubstruction}>
      <span>
        <svg
          viewBox="0 0 20 20"
          className="Polaris-Icon__Svg_375hu"
          focusable="false"
          aria-hidden="true"
        >
          <path d="M15 9H5a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2z"></path>
        </svg>
      </span>
    </button>
  </div>
</div>);
}
export default ColorStop;
