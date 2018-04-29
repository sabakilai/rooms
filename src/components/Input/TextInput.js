import React from 'react';
import { withFormsy } from 'formsy-react';
import { FormControl, HelpBlock, FormGroup, ControlLabel } from 'react-bootstrap';

class TextInput extends React.Component {
    constructor(props) {
        super(props);
        this.changeValue = this.changeValue.bind(this);
    }

    changeValue(event) {
        this.props.setValue(event.currentTarget.value);
    }

    render() {
        const { type, defaultValue, label, placeholder } = this.props;
        const errorMessage = this.props.getErrorMessage();

        return (
            <FormGroup validationState={errorMessage ? 'error' : null}>
                <ControlLabel>{label}</ControlLabel>
                <FormControl type={type}
                             placeholder={placeholder}
                             defaultValue={defaultValue}
                             value={this.props.getValue() || ''}
                             onChange={this.changeValue} />
                <HelpBlock>{errorMessage ? Object.values(errorMessage) : ''}</HelpBlock>
            </FormGroup>
        )
    }
}

export default withFormsy(TextInput);