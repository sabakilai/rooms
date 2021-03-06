import React, { Component } from 'react';

const conference = window.conference;
const getUserMedia = window.getUserMedia;
const io = window.io;
const captureUserMedia = window.captureUserMedia;
const videosContainer = window.videosContainer;
const config = {};

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

class VideoChatFormM3 extends Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
        this.init();
    }
    init() {
        this.config = {
            openSocket: function (config) {
                var SIGNALING_SERVER = 'https://webrtcweb.com:9559/',
                    defaultChannel = window.location.href.replace(/\/|:|#|%|\.|\[|\]/g, '');
    
                var channel = config.channel || defaultChannel;
                var sender = Math.round(Math.random() * 999999999) + 999999999;
    
                io.connect(SIGNALING_SERVER).emit('new-channel', {
                    channel: channel,
                    sender: sender
                });
    
                var socket = io.connect(SIGNALING_SERVER + channel);
                socket.channel = channel;
                socket.on('connect', function () {
                    if (config.callback) config.callback(socket);
                });
    
                socket.send = function (message) {
                    socket.emit('message', {
                        sender: sender,
                        data: message
                    });
                };
    
                socket.on('message', config.onmessage);
            },
            onRemoteStream: function (media) {
                var video = media.video;
                video.setAttribute('controls', true);
                video.setAttribute('id', media.stream.id);
                videosContainer.insertBefore(video, videosContainer.firstChild);
                video.play();
            },
            onRemoteStreamEnded: function (stream) {
                var video = document.getElementById(stream.id);
                if (video) video.parentNode.removeChild(video);
            },
            onRoomFound: function (room) {
                var alreadyExist = document.querySelector('button[data-broadcaster="' + room.broadcaster + '"]');
                if (alreadyExist) return;
    
                var tr = document.createElement('tr');
                tr.innerHTML = '<td><strong>' + room.roomName + '</strong> shared a conferencing room with you!</td>' +
                    '<td><button class="join">Join</button></td>';
                roomsList.insertBefore(tr, roomsList.firstChild);
    
                var joinRoomButton = tr.querySelector('.join');
                joinRoomButton.setAttribute('data-broadcaster', room.broadcaster);
                joinRoomButton.setAttribute('data-roomToken', room.broadcaster);
                joinRoomButton.onclick = function () {
                    this.disabled = true;
    
                    var broadcaster = this.getAttribute('data-broadcaster');
                    var roomToken = this.getAttribute('data-roomToken');
                    captureUserMedia(function () {
                        conferenceUI.joinRoom({
                            roomToken: roomToken,
                            joinUser: broadcaster
                        });
                    });
                };
            }
        };

        var conferenceUI = conference(config);
        var videosContainer = document.getElementById('videos-container') || document.body;
        var roomsList = document.getElementById('rooms-list');

        document.getElementById('setup-new-room').onclick = function () {
            this.disabled = true;
            captureUserMedia(function () {
                conferenceUI.createRoom({
                    roomName: 'Anonymous'
                });
            });
        };
    }
    captureUserMedia(callback) {
        var video = document.createElement('video');
        video.setAttribute('autoplay', true);
        video.setAttribute('controls', true);
        videosContainer.insertBefore(video, videosContainer.firstChild);

        getUserMedia({
            video: video,
            onsuccess: function (stream) {
                config.attachStream = stream;
                video.setAttribute('muted', true);
                callback();
            }
        });
    }
    render() {
        return (
            <div>
                <button id="setup-new-room">Setup New Conference</button>
                <table style="width: 100%;" id="rooms-list"></table>
                <div id="videos-container"></div>
            </div>
        )
    }
}

export default VideoChatFormM3;