import React, { Component } from 'react';
import FirebaseListItemComponent from './FirebaseListItemComponent';
import { Row } from 'react-bootstrap';

const firebase = window.firebase;

class FirebaseListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {elements: {}}
  }

  componentDidMount() {
    this.loadItems();
    this.bindHandlers();
  }

  loadItems() {
    if(!this.getRef) {
      console.warn('Set firebase database ref getter for FirebaseListComponent');
    }
    firebase.database().ref(this.getRef()).once('value')
    .then(items => {
      let elements = {};
      items.forEach(item => {
        elements[item.key] = this.getItemComponent(item);
      });
      this.setState({elements: elements});
    });
  }

  bindHandlers() {
    if(!this.getRef) {
      console.warn('Set firebase database ref getter for FirebaseListComponent');
    }
    firebase.database().ref(this.getRef()).on('child_added', item => {
      let elements = this.state.elements;
      elements[item.key] = this.getItemComponent(item);
      this.setState({elements: elements});
      if(this.props.onItemAdded) this.props.onItemAdded();
    });

    firebase.database().ref(this.getRef()).on('child_removed', item => {
      let elements = this.state.elements;
      delete elements[item.key];
      this.setState({elements: elements});
      if(this.props.onItemRemoved) this.props.onItemRemoved();
    });
  }

  getItemComponent(item) {
    return <FirebaseListItemComponent item={item} key={item.key} />
  }

  render() {
    return (
      <Row>
        {Object.values(this.state.elements)}
      </Row>
    )
  }
}

export default FirebaseListComponent;