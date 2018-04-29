import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap';


class RoomListItem extends Component {
  constructor(props) {
    super(props);

    this.state = { room: props.item.val(), roomId: props.item.key };
  }
  
  render() {
    return (
      <Col md={12}>
            <Link to={`/room/${this.state.roomId}`}>{this.state.room.name}</Link>
      </Col>
    )
  }
}

export default RoomListItem;
