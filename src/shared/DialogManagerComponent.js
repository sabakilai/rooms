import React, { Component } from 'react';


class DialogManagerComponent extends Component {
  constructor(props) {
    super(props);
    window.DialogManager = {showDialog: this.showDialog.bind(this)};
    this.state = { dialog: null };
  }

  showDialog(dialog) {
    this.setState({dialog});
  }

  render() {
    return (
      <div>
        {this.state.dialog}
      </div>
    )
  }
}

export default DialogManagerComponent;