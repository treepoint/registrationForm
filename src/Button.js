import React from "react";

class Button extends React.Component {
  render() {
    return (
      <div>
        <input type="submit" className="button" value={this.props.value} />
      </div>
    );
  }
}

export default Button;
