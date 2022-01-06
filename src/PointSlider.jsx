import React, { Component, createRef } from "react";
import { createRandomId, getValidateRatio } from "./util";


export default class PointSlider extends Component {
  constructor(props) {
    super(props);
    this.$pointBar = createRef();
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  }

  getLeftRatio(e) {
    const $target = this.$pointBar.current;
    const targetLeft = $target.getBoundingClientRect().left;
    const targetWidth = $target.offsetWidth;
    const mouseLeft = e.pageX;
    const ratio = parseInt(((mouseLeft - targetLeft - 9) * 100) / targetWidth)
    return getValidateRatio(ratio);
  }

  addPoint(e) {
    if (this.draggingId) return;
    const { pointList, onChangePointList, actValue } = this.props;
    const ratio = this.getLeftRatio(e);
    const arr = pointList.map(item => ({ ...item, active: false }));
    arr.push({
      ...actValue,
      distance: `${getValidateRatio(ratio)}%`,
      id: createRandomId(),
      active: true
    });
    onChangePointList(arr);
  }

  setItemActive(id) {
    const { pointList, onChangePointList } = this.props;
    onChangePointList(
      pointList.map(item => ({
        ...item,
        active: item.id === id
      }))
    );
  }
  onMouseMove = e => {
    const { pointList, onChangePointList } = this.props;
    const ratio = this.getLeftRatio(e);
    const arr = pointList.map(item => ({
      ...item,
      distance: item.active ? `${ratio}%` : item.distance
    }));
    onChangePointList(arr);
    e.preventDefault();
  };
  onMouseUp = e => {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
    this.draggingId = null;
    e.preventDefault();
  };

  onMouseDown = (e, item) => {
    this.draggingId = item.id;
    this.setItemActive(item.id);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
    e.stopPropagation();
    e.preventDefault();
  };

  render() {
    const { pointList, linearColorString } = this.props;

    return (
      <div className="point-slider-container">
        <div className="point-bar-container" ref={this.$pointBar}>
          <div
            className="point-bar"
            style={{ background: linearColorString }}
            onClick={e => this.addPoint(e)}
          ></div>
          {pointList.map(item => (
            <div
              className={`point-item ${item.active ? "active" : ""}`}
              key={item.id}
              style={{ left: item.distance }}
              onMouseDown={e => this.onMouseDown(e, item)}
            ></div>
          ))}
        </div>
      </div>
    );
  }
}
