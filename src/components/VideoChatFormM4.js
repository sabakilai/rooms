import React, { Component } from 'react';
import getUserMedia from 'getusermedia';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

class VideoChatFormM4 extends Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
        this.init();
    }

    init() {
        console.log('init');
        var phone = window.PHONE({
            number        : '123456',
            publish_key   : 'pub-c-0dfdf9ac-b296-4122-9ac3-6ba955e94dbf',
            subscribe_key : 'sub-c-c8fbff52-2b5b-11e8-85fd-a682db239c54',
            media         : { audio : true, video : true },
            ssl: true
        });
        // As soon as the phone is ready we can make calls
        phone.ready(function(){
            // Dial a Number and get the Call Session
            // For simplicity the phone number is the same for both caller/receiver.
            // you should use different phone numbers for each user.
            var session = phone.dial('123456');

        });

        // When Call Comes In or is to be Connected
        phone.receive(function(session){
            // Display Your Friend's Live Video
            session.connected(function(session){
                //document.getElementById('video-out').appendChild(session.video);
                console.dir(session);
                phone.$('video-out').appendChild(session.video);
            });

        });
    }

    render() {
        return (
            <div>
                <div id="video-out"> Making a Call </div>
            </div>
        )
    }
}

export default VideoChatFormM4;