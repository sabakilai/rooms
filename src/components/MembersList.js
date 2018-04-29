import React from 'react';
import FirebaseListComponent from './FirebaseListComponent';
import MemberListItem from './MemberListItem';


class MembersList extends FirebaseListComponent {

  getRef() {
    return `/online/${this.props.roomId}`;
  }

  getItemComponent(item) {
    return <MemberListItem item={item} key={item.key} />
  }
}

export default MembersList;