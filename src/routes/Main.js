import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { RoomList, CreateRoomForm } from '../components';

// services
import { AuthService } from '../services/auth';

class Main extends Component {
  constructor(props){
    super(props);
  }   
  render() {
    return (
      <Row>
        <Col md={6}>
          <h1>Join existing room</h1>
          <RoomList/>
        </Col>
        <Col md={6}>
          <h2>Create room</h2>
          <CreateRoomForm/>
        </Col>
      </Row>
    )
  }
}

export default Main;