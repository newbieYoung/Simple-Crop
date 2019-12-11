import React from "react";
import ReactDOM from "react-dom";
import SimpleCrop from "../index-react.jsx";

class Test2 extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <h3> hello react simple crop</h3>;
  }
}

ReactDOM.render(<Test2 />, document.querySelector("#app"));
