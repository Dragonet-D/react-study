import React, {Component} from 'react';

class Progress extends Component {
  changeProgress() {
    this.props.onProgressChange(progress)
  }

  render() {
    return (
      <div
        className="component-progress row"
        onClick={this.changeProgress}
      >
        <div className="progress">
        </div>
      </div>
    )
  }
}

export default Progress