import React, { Component } from 'react';
import Peer from 'peerjs';
const peer = new Peer({key: 'lwjd5qra8257b9'});
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

class VideoChatForm extends Component {
    constructor(props) {
        super(props);
        this.peerInit = this.peerInit.bind(this);
        this.makeCall = this.makeCall.bind(this);
        // this.peerInit = this.peerInit.bind(this);
        this.step1();
        this.peerInit();
    }

    peerInit() {
        const self = this;
        peer.on('open', function(id) {
            document.getElementById('yourId').value = id;
            console.log('My peer ID is: ' + id);
        });
        
        peer.on('call', function(call){
            call.answer(window.localStream)
            self.step3(call)
        })
        
        peer.on('error', function(err){
            alert(err.message);
        });
    }

    makeCall() {
        var otherId = document.getElementById('callto-id').value;
        var call = peer.call(otherId,window.localStream)

        this.step3(call);
    }

    endCall() {
        window.exisctingCall.close();
    }

    step1(){
        navigator.getUserMedia({audio:true, video:true},function(stream){
            document.getElementById('my-video').src = window.URL.createObjectURL(stream)
            window.localStream = stream;
        }, function(err){
            console.log('some error: ', err);
        })
    }

    step3(call) {
        if(window.exisctingCall){
            window.exisctingCall.close();
        }
    
        call.on('stream', function(stream){
            document.getElementById('their-video').src= window.URL.createObjectURL(stream)
        })
    
        window.exisctingCall = call;
    
        call.on('close', function(){
            console.log('call ended')
        })
    }
    

    render() {
        return (
            <div>
                <div className="pure-u-2-3" id="video-container">
                    <video id="their-video" autoPlay></video>
                    <video id="my-video" muted="true" autoPlay></video>
                    <video id="their-video-another" autoPlay></video>
                </div>

                <input type="text" placeholder="Call user id..." id="callto-id" />
                <a href="#" className="pure-button pure-button-success" id="make-call" onClick={this.makeCall}>Call</a>

                <p><a href="#" className="pure-button pure-button-error" id="end-call" onClick={this.endCall}>End call</a></p>

                <label>Your ID</label>
                <textarea id="yourId"></textarea>
            </div>
        )
    }
}

export default VideoChatForm;