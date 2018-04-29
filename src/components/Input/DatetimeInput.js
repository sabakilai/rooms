import React from 'react';
import {withFormsy} from 'formsy-react';
import DateTime from 'react-datetime';
import {ControlLabel, HelpBlock, FormGroup} from 'react-bootstrap';

const formatDate = "DD.MM.YYYY HH:mm:ss";

const valid = (current) => {
    const yesterday = DateTime.moment().subtract(1, 'day');
    return current.isAfter(yesterday)
};

class DatetimeInput extends React.Component {
    constructor(props) {
        super(props);
        this.changeValue = this.changeValue.bind(this);
    }

    changeValue(event) {
        if (event.isValid) {
            this.props.setValue(event.format(formatDate));
        }
    }

    render() {
        const {name} = this.props;
        const errorMessage = this.props.getErrorMessage();

        return (
            <FormGroup validationState={errorMessage ? 'error' : null}>
                <ControlLabel>{this.props.label}</ControlLabel>
                <DateTime inputProps={ { name:  name} } dateFormat="DD-MM-YYYY"
                          isValidDate={valid} onChange={this.changeValue} />
                <HelpBlock>{errorMessage ? Object.values(errorMessage) : ''}</HelpBlock>
            </FormGroup>
        )
    }
}

export default withFormsy(DatetimeInput);