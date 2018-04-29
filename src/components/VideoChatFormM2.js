import React, { Component } from 'react';
import Peer from 'simple-peer';
import getUserMedia from 'getusermedia';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

class VideoChatFormM2 extends Component {
    constructor(props) {
        super(props);
        this.peerInit = this.peerInit.bind(this);
        this.peerInit();
    }

    peerInit() {
        getUserMedia({ video: true, audio: false }, function (err, stream) {
            if (err) {
                console.error(err);
                return console.error(err);
            }
            const peer = new Peer({
                initiator: window.location.hash === '#init',
                trickle: false,
                stream: stream
            });
        
            peer.on('signal', function (data) {
                document.getElementById('yourId').value = JSON.stringify(data);
            });
        
            document.getElementById('connect').addEventListener('click', function () {
                let otherId = JSON.parse(document.getElementById('otherId').value);
                peer.signal(otherId);
            });
        
            document.getElementById('send').addEventListener('click', function () {
                let yourMessage = document.getElementById('yourMessage').value;
                peer.send(yourMessage);
            });
        
            peer.on('data', function (data) {
                document.getElementById('messages').textContent += data + '\n';
            });
        
            peer.on('stream', function (stream) {
                console.log('stream');
                let video = document.querySelector('video');
                video.src = window.URL.createObjectURL(stream);
                video.play();
            });
        
        });
    }

    render() {
        return (
            <div>
                <label>Your ID:</label><br/>
                <textarea id="yourId"></textarea><br/>

                <label>Other ID:</label><br/>
                <textarea id="otherId"></textarea><br/>
                <button id="connect">connect</button><br/>

                <label>Enter Message</label><br/>
                <textarea id="yourMessage"></textarea><br/>
                <button id="send">send</button><br/>
                <pre id="messages"></pre>

                <video></video>
            </div>
        )
    }
}

export default VideoChatFormM2;