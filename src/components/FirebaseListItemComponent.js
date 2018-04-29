import React, { Component } from 'react';
import { Col } from 'react-bootstrap';


class FirebaseListItemComponent extends Component {
  render() {
    return (
      <Col md={12}>{this.props.item.key}</Col>
    )
  }
}

export default FirebaseListItemComponent;