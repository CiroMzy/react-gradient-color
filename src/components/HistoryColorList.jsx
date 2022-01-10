import React from "react";

function HistoryColorList({ onChange, history = [] }) {
  return (
    <div className="history-list">
      <div>最近所选：</div>
      <div className="list">
        {history.map((color) => (
          <button
            onClick={() => onChange(color)}
            type="button"
            className="item"
            aria-label="最近所选"
            key={color}
          >
            <div
              className="btn"
              style={{
                background: color,
              }}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
}
export default HistoryColorList;
