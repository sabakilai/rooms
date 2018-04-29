import { Component } from 'react';


class FormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false
    };

    this.handleForm = this.handleForm.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.enableButton = this.enableButton.bind(this);
  }

  disableButton() {
    this.setState({canSubmit: false})
  }

  enableButton() {
    this.setState({canSubmit: true})
  }

  getFormValues(form) {
    form = new FormData(form);
    let output = {};
    for( const [key, value] of form.entries()) {
      output[key] = value;
    }
    return output;
  }
}

export default FormComponent;