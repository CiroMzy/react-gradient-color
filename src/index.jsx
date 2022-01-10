import React, { Component, createRef } from "react";
import { ChromePicker } from "react-color";
import PointSlider from "./components/PointSlider";
import DefaultColorList from "./components/DefaultColorList";
import HistoryColorList from "./components/HistoryColorList";
import InputNumber from "./components/InputNumber";
import DeleteBtn from "./components/DeleteBtn";
import GradientType from "./components/GradientType";
import ColorStop from "./components/ColorStop";
import { createRandomId, getRgbaObj, getConcatValue, parseValue, isColorEqual } from "./util";
import {
  DEFAULT_EDIT_TYPE,
  DEFAULT_GRADIENT_TYPE,
  DEFAULT_LINEAR_DEG,
  DEFAULT_ADD_DISTANCE
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
    this.resetData(this.props.value);
  }

  componentDidUpdate(preProps) {
    const prePropsValue = preProps.value;
    const { gradientType, linearDeg, pointList } = this.state;
    const curValue = getConcatValue({
      gradientType,
      linearDeg,
      pointList,
    });

    if (
      prePropsValue &&
      prePropsValue.indexOf("-gradient(") > -1 &&
      !isColorEqual(prePropsValue, curValue)
    ) {
      this.onChangeValue(curValue);
    }
  }

  resetData(colorString) {
    const { pointList, linearDeg, gradientType } = this.state;
    const parsedValue = parseValue({
      pointList,
      linearDeg,
      gradientType,
      colorString,
    });
    this.onChangePointList(parsedValue.pointList, {
      linearDeg: parsedValue.linearDeg,
      gradientType: parsedValue.gradientType,
    });
  }

  onChangeValue(val) {
    const { onChange } = this.props;
    onChange && onChange(val);
  }

  getActiveValue() {
    const { pointList } = this.state;
    return pointList.find(({ active }) => active) || {};
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
      // message.error("最少保留种颜色");
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
      distance: DEFAULT_ADD_DISTANCE,
      active: false,
      id: createRandomId(),
    });
    this.onChangePointList(pointList);
  };

  render() {
    const { style } = this.props;
    const { history, pointList, gradientType, linearDeg } = this.state;
    const colorString = getConcatValue({
      gradientType,
      linearDeg,
      pointList,
    });
    const linearColorString = getConcatValue({
      gradientType,
      linearDeg,
      pointList,
      isLinear: true,
    });
    const actValue = this.getActiveValue();
    return (
      <div
        className="gradient-color-picker-container"
        ref={this.$container}
        style={style}
      >
        {!pointList.length ? (
          <DefaultColorList onChange={(color) => this.onSelectDefault(color)} />
        ) : (
          <>
            <div
              className="gradient-dasboard"
              style={{ background: colorString }}
            ></div>
            <GradientType
              gradientType={gradientType}
              linearDeg={linearDeg}
              onChangeGradientType={type => this.onChangeGradientType(type)}
              onChangeDeg={e => this.onChangeDeg(e)}
            />
            <PointSlider
              pointList={pointList}
              onChangePointList={this.onChangePointList}
              colorString={colorString}
              linearColorString={linearColorString}
              actValue={actValue}
            />

            <ColorStop
              onAdd={this.addition}
              onSubstruction={this.substruction}
            />
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
              color={getRgbaObj(actValue.color)}
              onChange={this.handleColorChange}
            />
            <HistoryColorList
              history={history}
              onChange={(color) => this.setActiveColor(color)}
            />
            <DeleteBtn onClick={() => this.onSelectDefault("")} />
          </>
        )}
      </div>
    );
  }
}
export default GradientColor;
