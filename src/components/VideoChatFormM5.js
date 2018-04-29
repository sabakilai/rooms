import React, { Component } from 'react';
import $ from 'jquery';

const firebase = window.firebase;

let vidCount  = 0;
const vidBox = {
    display: 'inline-block',
    textAlign: 'center',
    width: '100%'
};
const vidBoxVideo = {
    width: '47%'
};
class VideoChatFormM5 extends Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
        this.login = this.login.bind(this);
        this.addLog = this.addLog.bind(this);
        this.end = this.end.bind(this);
        this.getVideoGroup = this.getVideoGroup.bind(this);
        this.makeCall = this.makeCall.bind(this);
        this.state = {
            getVideoChat: firebase.database().ref(`/videoChats/${this.props.roomId}`),
            videoChatId: {}
        };
        this.init();
    }

    init() {
        console.log('init');
	    var host = 'kevingleason.me';
	    if ((host == window.location.host) && (window.location.protocol != "https:"))
	        window.location.protocol = 'https';
    }

    getVideoGroup() {
        this.state.getVideoChat.once('value')
        .then(videoChat => {
            console.log(videoChat.val());
            this.setState({videoChatId: videoChat.val()});
            if(!videoChat.exists()) {
                this.state.getVideoChat.set(firebase.auth().currentUser.uid);
                this.setState({
                    videoChatId: firebase.auth().currentUser.uid,
                    vidCount: 0
                });
            };
            this.login();
        });
        /*getVideoGroudId.on('child_added', item => {
            let elements = this.state.elements;
            elements[item.key] = this.getItemComponent(item);
            this.setState({elements: elements});
        });*/
    }
    
    login() {
        console.log('login');
        let phone = window.phone;
        phone = window.phone = window.PHONE({
            number        : firebase.auth().currentUser.uid || 'Anonymous', // listen on username line else Anonymous
            publish_key   : 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c', // Your Pub Key
            subscribe_key : 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe', // Your Sub Key
        });
        const ctrl = window.ctrl = window.CONTROLLER(phone);
        ctrl.ready(function(){
            console.log('ctrl.ready');
            ctrl.addLocalStream(document.getElementById('vid-thumb'));
            $('#logs').append('<p>Logged in as ' + firebase.auth().currentUser.uid +'</p>');
            this.makeCall();
        }.bind(this));

        ctrl.receive(function(session){
            console.log('ctrl.receive: ', session);
            let video_out = document.getElementById('vid-box');
            session.connected(function(session){
                console.log('session.connected', session);
                video_out.appendChild(session.video);
                let date = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
                $('#logs').append( '(' + date + ') ' + session.number + ' has joined.<br/>');
                vidCount++;
            }.bind(this));
            session.ended(function(session) {
                console.log('session.ended', session);
                /*if (this.state.videoChatId !== firebase.auth().currentUser.uid ) {
                    window.ctrl.hangup(this.state.videoChatId);
                } else {
                    window.ctrl.hangup();
                }*/
                ctrl.getVideoElement(session.number).remove();
                let date = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
                $('#logs').append('(' + date + ') ' + session.number + ' has left.<br/>');
                vidCount--;
            }.bind(this));
        });
        ctrl.videoToggled(function(session, isEnabled){
            ctrl.getVideoElement(session.number).toggle(isEnabled);
            $('#logs').append("<p>" + session.number + ': video enabled - ' + isEnabled +'</p>');
        });
        ctrl.audioToggled(function(session, isEnabled){
            ctrl.getVideoElement(session.number).css('opacity', isEnabled ? 1 : 0.75);
            $('#logs').append('<p>' + session.number + ': audio enabled - ' + isEnabled + '</p>');
        });
    }

    makeCall() {
        console.log('makeCall');
        if (!window.phone) alert('Login First!');
        let videoChatId = this.state.videoChatId;
        if (!videoChatId) {
            videoChatId = firebase.auth().currentUser.uid;
            this.state.getVideoChat.set(videoChatId);
        }
        if (window.phone.number()==videoChatId) {
            this.setState({isCall: true});
            return false; // No calling yourself!
        }
        window.ctrl.isOnline(videoChatId, function(isOn) {
            this.setState({isCall: true});
            if (isOn) {
                window.ctrl.dial(videoChatId);
            } else {
                console.log('User is Offline');
                videoChatId = firebase.auth().currentUser.uid;
                this.state.getVideoChat.set(videoChatId);
            }
        }.bind(this));
    }

    mute() {
        if (!window.ctrl || !window.ctrl.toggleAudio) {
            console.log('not have video');
            return;
        }
        const audio = window.ctrl.toggleAudio();
        if (!audio) {
            $('#mute').html('Unmute');
        } else {
            $('#mute').html('Mute');
        }
    }

    end() {
        console.log('end');
        /*if (this.state.videoChatId !== firebase.auth().currentUser.uid ) {
            window.ctrl.hangup(this.state.videoChatId);
        } else {
            window.ctrl.hangup();
        }*/
        window.ctrl.hangup();
        this.setState({isCall: false});
        //window.ctrl.leaveStream();
        // window.PUBNUM.leave()
        // this.pause();
        window.ctrl.getVideoElement(firebase.auth().currentUser.uid).remove();
        /*let videoElem = document.getElementById('vid-thumb');
        if (videoElem) {
            videoElem.innerHTML = '';
        }*/
    }

    getVideo(number) {
        return $('*[data-number="'+number+'"]');
    }

    addLog(log) {
        $('#logs').append('<p>' + log + '</p>');
    }

    pause() {
        if (!window.ctrl || !window.ctrl.toggleAudio) {
            console.log('not have video');
            return;
        }
        const video = window.ctrl.toggleVideo();
        if (!video) $('#pause').html('Unpause'); 
        else $('#pause').html('Pause'); 
    }

    errWrap(fxn, form){
        console.log('errWrap');
        try {
            return fxn(form);
        } catch(err) {
            alert('WebRTC is currently only supported by Chrome, Opera, and Firefox');
            return false;
        }
    }

    render() {
        return (
            <div>
                <div id="vid-box" className="video2" style={vidBox}></div>
                <div id="vid-thumb" style={vidBoxVideo}></div>
                {
                    this.state.isCall ?
                    <div id="inCall" className="ptext btn-group">
                        <button id="end" onClick={this.end} className="btn btn-danger">End</button>
                        <button id="mute" onClick={this.mute} className="btn btn-warning">Mute</button> 
                        <button id="pause" onClick={this.pause} className="btn btn-primary">Pause</button>
                    </div> : 
                    <button id="login_submit" className="btn btn-success"
                        type="button" onClick={this.getVideoGroup}>
                        Video call
                    </button>
                }
                <br/>
                
                Количество подключенных: <b>{this.state.vidCount}</b>
                <div id="logs" className="ptext"></div>
            </div>
        )
    }
}

export default VideoChatFormM5;