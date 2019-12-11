import React from "react";
import Core from "./index.js";

export class SimpleCrop extends React.Component {
  instance; //实例

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.instance = new Core(this.props);
  }

  render() {
    return <div />;
  }
}
