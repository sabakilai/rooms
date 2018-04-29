
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Button } from 'react-bootstrap';
import './FullscreenVideo.css'
import Chat from '../components/Chat';
import MembersList from '../components/MembersList';
import * as url from 'url';

const videojs = require('video.js');
const schedule = require('node-schedule');
require('videojs-flash'); 

const PLAYER_STATUSES = {
  NOTLOADED: 0,
  PAUSED: 1,
  PLAYING: 2
};
const firebase = window.firebase;

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {playerState: null, playButtonDisabled:true};
    this.componentsMounted = false;
  }

  componentWillMount(){
    firebase.database().ref(`/player/${this.props.roomId}/video_url/${firebase.auth().currentUser.uid}`).onDisconnect().remove();
  }

  componentDidMount() {
    firebase.database().ref(`/player/${this.props.roomId}`).once('value')
    .then(player => {
      if(!player.exists()) {
        if(this.props.membership) {
          this.initializePlayer();
        }
        return;
      }
      this.setState({playerState: player.val()});
    });
    firebase.database().ref(`/player/${this.props.roomId}`).on('value', (player) => {
      if(!player.exists()) {
        if(this.props.membership) {
          this.initializePlayer();
        }
        return;
      }
      this.setState({playerState: player.val()});
    });
    this.autoPlay();
    this.videoPositionId = setInterval(function() {
      this.playerSync();
    }.bind(this), 4000);
    
    
  }

  componentDidUpdate() {
    this.reloadPlayer();
    if(!this.state.playerState) return;
    if(this.state.playerState.status == PLAYER_STATUSES.PLAYING && this.player) this.player.play();
    if(this.state.playerState.status == PLAYER_STATUSES.PAUSED && this.player && !this.player.paused()) this.player.pause();
    
  }

  autoPlay() {
    const date = this.props.room.startTime.split(' ')[0].split('.')
    const hours = this.props.room.startTime.split(' ')[1].split(':')
    const startTimeDate = new Date(Number(date[2]), date[1] - 1, Number(date[0]), Number(hours[0]), Number(hours[1]), Number(hours[2]));
    const j = schedule.scheduleJob(startTimeDate, function(){
      firebase.database().ref(`/player/${this.props.roomId}`).update({
        status: PLAYER_STATUSES.PLAYING
      });
    }.bind(this));
  }

  playerSync() {
    if(!this.player) return
    if(this.props.membership) {
      if (this.state.playerState && this.state.playerState.status===2) {
        firebase.database().ref(`/player/${this.props.roomId}`).update({
          position: this.player.currentTime()
        });
      }
    }
  }

  initializePlayer() {
    firebase.database().ref(`/player/${this.props.roomId}`).update({
      status: PLAYER_STATUSES.NOTLOADED
    });
  }

  fullScreen(){
    this.player.requestFullscreen();
    if(this.componentsMounted) return;
    this.player.addChild('vjsFullscrenList', {component:'MemberList', className:'vjs-member-list', roomId:this.props.roomId});
    this.player.addChild('vjsFullscrenList', {component:'MessageList', className:'vjs-message-list', roomId:this.props.roomId});
    this.componentsMounted = true;
  }

  play() {
    if(!this.player) return;
    if(this.props.membership) {
      firebase.database().ref(`/player/${this.props.roomId}`).update({
        status: PLAYER_STATUSES.PLAYING
      });
    }
  }

  pause() {
    if(!this.player) return;
    if(this.props.membership) {
      firebase.database().ref(`/player/${this.props.roomId}`).update({
        status: PLAYER_STATUSES.PAUSED
      });
    }
  }

  reloadPlayer() {
    if(!this.playerNode) return;
    this.player = videojs(this.playerNode);

    if(!this.player.src() && this.state.playerState.video_url && this.state.playerState.video_url[firebase.auth().currentUser.uid]) {
      
      let type = 'video/mp4';
      const position = this.state.playerState.position;
      const video_url = this.state.playerState.video_url[firebase.auth().currentUser.uid]

      if (video_url.substr(video_url.length - 3)== 'flv') type='video/x-flv'
      this.player.src({type: type, src:video_url });
  
      if (type=='video/mp4') {
        console.log('caled')
        this.player.currentTime(this.state.playerState.position);
        if (!this.state.playButtonDisabled) return
        this.setState({playButtonDisabled:false})
        
      } else {
        this.player.on("progress", function() {
          if(this.player.bufferedPercent()>position/this.player.duration() +0.05)  {
            if (this.player.currentTime() == position || this.player.currentTime() > position) return
            this.player.currentTime(position);
            this.setState({playButtonDisabled:false})
          }
        }.bind(this));
      }
    }
    window.player = this.player;
  }

  componentWillUnmount() {
    clearInterval(this.videoPositionId);
    if (this.player) this.player.dispose();
  }
  
  
  render() {
    if(!this.state.playerState) return '';
    return (
      <Row>
        <Col md={12}>
        <video id='screen' ref={ node => this.playerNode = node } className="video-js" preload="auto" data-setup='{}' width="700px" ></video>  
        </Col>
        <Col md={12}>
          { this.state.playerState.status != PLAYER_STATUSES.PLAYING  ? <Button disabled={this.state.playButtonDisabled} onClick={this.play.bind(this)}>Play</Button> : <Button onClick={this.pause.bind(this)}>Pause</Button> }
          <Button onClick={this.fullScreen.bind(this)}>Full</Button>
        </Col>
      </Row>
    )
  }
}

class FullscreenList extends Component {
  render() {
    let className = "vjs-component " + this.props.className
    let list;
    if (this.props.component=='MemberList') list = <MembersList roomId={this.props.roomId} />
    if (this.props.component=='MessageList') list = <Chat roomId={this.props.roomId} />
    return (
      <div className={className}>
        {list}
      </div>
    );
  }
}

const vjsComponent = videojs.getComponent('Component');

class vjsFullscrenList extends vjsComponent {

  constructor(player, options) {
    super(player, options);
    if (options.component) this.component= options.component;
    if (options.roomId) this.roomId= options.roomId;
    if (options.className) this.className= options.className;

    this.mount = this.mount.bind(this);

    player.ready(() => {
      this.mount();
    });
  }
  mount() {
    ReactDOM.render(<FullscreenList roomId={this.roomId} vjsComponent={this} component={this.component} className={this.className}/>, this.el() );
  }
}

vjsComponent.registerComponent('vjsFullscrenList', vjsFullscrenList);


export default VideoPlayer;