import React from "react";
import ReactDOM from "react-dom";
// import GradientColor from "../lib/index"; // 使用打包后的文件测试
import GradientColor from "../src"; // 使用dev文件测试
import "antd/dist/antd.min.css";
import "./doc.scss";
class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  onChange = (value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <div className="gradient-demo-container">
        <div
          className={`btn ${value ? "" : "empty"}`}
          style={{ background: value }}
          onClick={() => this.setState({ visiable: true })}
        ></div>
        <div className="gradient-demo">
          <GradientColor value={value} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}

if (typeof document !== "undefined") {
  ReactDOM.render(React.createElement(Demo), document.getElementById("root"));
}

export default Demo;
