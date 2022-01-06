import React, { Component, createRef } from "react";
import { findDOMNode } from "react-dom";
import { InputNumber, message } from "antd";
import { ChromePicker } from "react-color";
import PointSlider from "./PointSlider";
import { createRandomId } from "./util";
import {
  DEFAULT_COLOR_LIST,
  DEFAULT_EDIT_TYPE,
  DEFAULT_GRADIENT_TYPE,
  DEFAULT_LINEAR_DEG,
} from "./ENUM";
import "./gradientColor.module.scss";

/********
 * @param {string} value 当前选中渐变颜色
 * @param {fn} onChange 当前选中颜色更新
 * @param {object} style 容器样式
 */
class GradientColor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editType: DEFAULT_EDIT_TYPE,
      gradientType: DEFAULT_GRADIENT_TYPE,
      linearDeg: DEFAULT_LINEAR_DEG,
      pointList: [],
      history: [],
    };
    this.$container = createRef();
    this.activeId = null;
  }
  componentDidMount() {
    document.addEventListener("click", this.onClickHandler);
    this.resetData(this.props.value);
  }

  componentDidUpdate(preProps) {
    const prePropsValue = preProps.value;
    const curValue = this.getConcatValue();

    if (
      prePropsValue &&
      prePropsValue.indexOf("-gradient(") > -1 &&
      !this.isColorEqual(prePropsValue, curValue)
    ) {
      this.onChangeValue(curValue);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.onClickHandler);
  }

  isColorEqual(color1, color2) {
    return color1.replace(/\s/g, "") === color2.replace(/\s/g, "");
  }

  resetData(propsValue) {
    const { pointList, linearDeg, gradientType } = this.parseValue(propsValue);
    this.onChangePointList(pointList, { linearDeg, gradientType });
  }

  onClickHandler = (e) => {
    const { onClose } = this.props;
    if (this.$container.current) {
      let result = findDOMNode(this.$container.current).contains(e.target);
      if (!result) {
        onClose();
      }
    }
  };

  onChangeValue(val) {
    const { onChange } = this.props;
    setTimeout(() => {
      onChange(val);
    });
  }

  getActiveValue() {
    const { pointList } = this.state;
    return pointList.find(({ active }) => active) || {};
  }

  getConcatValue(props = {}) {
    const state = props.state || this.state;
    const isLinear = props.isLinear;
    const { gradientType, linearDeg, pointList } = state;
    const type = isLinear ? "linear" : gradientType;
    if (!pointList.length) {
      return "";
    }

    return `${type}-gradient(${
      type === "linear" ? `${linearDeg}deg, ` : ""
    }${pointList.map(({ color, distance }) => `${color} ${distance}`)})`;
  }

  parseValue(str) {
    let pointList = [];
    let colorString = str;
    if (!colorString) {
      return { ...this.state, pointList: [] };
    }
    let gradientType,
      linearDeg = this.state.linearDeg;
    let noGradientStr = colorString.replace(
      /^(.*?)-gradient\(([\s\S]*)\)/g,
      function ($0, $1, $2) {
        gradientType = $1;
        return $2;
      }
    );
    if (gradientType === "linear") {
      noGradientStr = noGradientStr.replace(/^(\d+)deg,/g, function ($0, $1) {
        linearDeg = $1;
        return "";
      });
    }

    let list = [];
    noGradientStr.replace(/\s{0,}(rgb.*?\)\s{0,}\d+\%)/g, function ($0, $1) {
      list.push($1);
      return $1;
    });
    pointList = list.map((str) => {
      const obj = {};
      str.replace(/(rgb.*?\))\s{0,}(\d+%)/g, function ($0, $1, $2) {
        obj.color = $1;
        obj.distance = $2;
        obj.id = createRandomId();
      });
      return obj;
    });
    return { pointList, linearDeg, gradientType };
  }

  onChangePointList = (list, config = {}) => {
    if (!Array.isArray(list)) {
      this.setState({ pointList: [] });
      return;
    }
    let pointList = list.sort((pre, next) => {
      return parseInt(pre.distance) - parseInt(next.distance);
    });
    const hasActive = pointList.some(({ active }) => active);
    if (!hasActive && pointList.length) {
      pointList[0].active = true;
    }
    this.setState({ pointList, ...config });
  };

  onChangeGradientType(gradientType) {
    this.setState({ gradientType });
  }

  onChangeDeg(linearDeg) {
    this.setState({ linearDeg });
  }

  onChangePosition = (distance) => {
    const { pointList } = this.state;
    const act = this.getActiveValue();
    act.distance = `${distance}%`;
    this.onChangePointList(pointList);
  };

  getRgbaObj(rgbaString) {
    let arr = [];
    if (!rgbaString) {
      arr = [255, 255, 255, 1];
    } else {
      let str = "";
      rgbaString.replace(/rgb\w?\((.*?)\)/g, function ($0, $1) {
        str = $1;
      });
      arr = str.split(",").map((i) => i.replace(/\s/g, ""));
    }
    return {
      r: arr[0],
      g: arr[1],
      b: arr[2],
      a: arr[3] == undefined ? 1 : arr[3],
    };
  }

  pushHistory(color) {
    const { history } = this.state;
    if (history.some((i) => i === color)) {
      return;
    }
    history.unshift(color);
    if (history.length > 6) {
      history.pop();
    }
    this.setState({ history });
  }

  setActiveColor(color) {
    const { pointList } = this.state;
    const arr = pointList.map((item) => ({
      ...item,
      color: item.active ? color : item.color,
    }));
    this.onChangePointList(arr);
  }

  handleColorChange = ({ rgb }) => {
    const color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
    this.setActiveColor(color);
    this.pushHistory(color);
  };

  onSelectDefault = (color) => {
    this.onChangeValue(color);
    setTimeout(() => {
      this.resetData(color);
    });
  };

  substruction = () => {
    const { pointList } = this.state;
    if (pointList.length <= 2) {
      message.error("最少保留种颜色");
      return;
    }
    const arr = pointList.filter(({ active }) => !active);
    arr[0].active = true;
    this.onChangePointList(arr);
  };

  addition = () => {
    const { pointList } = this.state;
    const act = this.getActiveValue();
    pointList.push({
      ...act,
      distance: "45%",
      active: false,
      id: createRandomId(),
    });
    this.onChangePointList(pointList);
  };

  renderEditingBoard() {
    const { history, pointList, gradientType, linearDeg } = this.state;
    const colorString = this.getConcatValue();
    const linearColorString = this.getConcatValue({ isLinear: true });
    const actValue = this.getActiveValue();
    return (
      <div>
        <div
          className="gradient-dasboard"
          style={{ background: colorString }}
        ></div>
        <div className="gradient-type-container">
          <div className="gradient-type">
            {["linear", "radial"].map((type) => (
              <input
                type="radio"
                className={`gradient-type-btn ${type} ${
                  type === gradientType ? "active" : ""
                }`}
                onClick={() => this.onChangeGradientType(type)}
                key={type}
              />
            ))}
          </div>
          {gradientType === "linear" && (
            <div className="gradient-linear-deg">
              <InputNumber
                min={0}
                value={linearDeg}
                onChange={(e) => this.onChangeDeg(e)}
              />
            </div>
          )}
        </div>
        <PointSlider
          pointList={pointList}
          onChangePointList={this.onChangePointList}
          colorString={colorString}
          linearColorString={linearColorString}
          actValue={actValue}
        />

        <div className="gradient-line">
          <span>颜色停止点：</span>
          <div className="gradient-stop-container">
            <button onClick={this.addition}>
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
            <button onClick={this.substruction}>
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
        </div>
        <div className="gradient-position">
          <div>位置：</div>
          <div>
            <InputNumber
              min={0}
              max={100}
              value={parseFloat(actValue.distance)}
              onChange={this.onChangePosition}
            />
          </div>
        </div>
        <ChromePicker
          color={this.getRgbaObj(actValue.color)}
          onChange={this.handleColorChange}
        />
        <div className="history-list">
          <div>最近所选：</div>
          <div className="list">
            {history.map((color) => (
              <button
                onClick={() => this.setActiveColor(color)}
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
        <div
          className="clean-value-container"
          onClick={() => this.onSelectDefault("")}
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
        </div>
      </div>
    );
  }

  renderDefaultSelection() {
    return (
      <div className="defaultSelection">
        <p className="info">选择渐变颜色</p>
        <ul>
          {DEFAULT_COLOR_LIST.map((item) => (
            <li
              key={item}
              style={{ background: item }}
              onClick={(e) => this.onSelectDefault(item)}
            ></li>
          ))}
        </ul>
      </div>
    );
  }

  render() {
    const { style } = this.props
    const { pointList } = this.state;
    return (
      <div className="gradient-color-picker-container" ref={this.$container}
      style={ style }
      >
        {!!pointList.length
          ? this.renderEditingBoard()
          : this.renderDefaultSelection()}
      </div>
    );
  }
}
module.exports = GradientColor