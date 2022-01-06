import React from "react";
import ReactDOM from "react-dom";
import { GradientColor } from "../lib/index";
import "antd/dist/antd.min.css";

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
      <div>
        <div
          style={{
            width: "300px",
          }}
        >
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
