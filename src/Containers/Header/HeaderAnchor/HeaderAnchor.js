import React from "react";
import "./HeaderAnchor.css";

class HeaderAnchor extends React.PureComponent {
  render() {
    return <div className="headerAnchor">{this.props.children}</div>;
  }
}
export default HeaderAnchor;
