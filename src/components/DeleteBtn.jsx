import React from "react";

function DeleteBtn({ onClick }) {
  return (<div
    className="clean-value-container"
    onClick={() => onClick("")}
  >
    <button className="clean-btn-container" type="button">
      <span className="clean-btn">
        <svg
          viewBox="0 0 20 20"
          className="Polaris-Icon__Svg_375hu"
          focusable="false"
          aria-hidden="true"
        >
          <path d="M8 3.994C8 2.893 8.895 2 10 2s2 .893 2 1.994h4c.552 0 1 .446 1 .997a1 1 0 0 1-1 .997H4c-.552 0-1-.447-1-.997s.448-.997 1-.997h4zM5 14.508V8h2v6.508a.5.5 0 0 0 .5.498H9V8h2v7.006h1.5a.5.5 0 0 0 .5-.498V8h2v6.508A2.496 2.496 0 0 1 12.5 17h-5C6.12 17 5 15.884 5 14.508z"></path>
        </svg>
      </span>
      <div className="_WrappedContent_1blto_112">
        <div className="_Content_1blto_124">删除梯度</div>
      </div>
    </button>
  </div>);
}
export default DeleteBtn;
