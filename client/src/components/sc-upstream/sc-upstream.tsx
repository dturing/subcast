import { Component, Prop, Watch, Event, EventEmitter, h } from '@stencil/core';
import Peer from 'peerjs';
import firebase from 'firebase/app';
import Firebase from '../../services/firebase';

@Component({
  tag: 'sc-upstream',
  styleUrl: 'sc-upstream.css',
  shadow: true
})
export class ScUpstream {

  @Prop() stream :MediaStream;

  @Event() updateUserProp: EventEmitter;
  
  private peer:Peer;
  private connection;

  componentWillLoad() {
  }

  @Watch("stream")
  haveStream(stream) {
    console.log("UPSTREAM has Stream:", stream);
  }
  
  componentDidLoad() {

    const rtcConfig = { iceServers: [{
       urls: [ "stun:e5.xirsys.com" ]
      }, {
       username: "c321833e-e1e2-11e8-9174-b58933bfffb3",
       credential: "c321847e-e1e2-11e8-b1f5-3a08e46af942",
       urls: [
           "turn:e5.xirsys.com:80?transport=udp",
           "turn:e5.xirsys.com:3478?transport=udp",
           "turn:e5.xirsys.com:80?transport=tcp",
           "turn:e5.xirsys.com:3478?transport=tcp",
           "turns:e5.xirsys.com:443?transport=tcp",
           "turns:e5.xirsys.com:5349?transport=tcp"
       ]
      }]};

    this.peer = new Peer({ config:rtcConfig }); //, host: 'proto.f3c.com', port: 9002, path: '/plnt' });
    this.peer.on('error', (err) => { 
      console.log("PEER ERROR", err);
    });
    this.peer.on('connection', (conn) => {
      conn.on("data", (data) => {
        try {
          var d = JSON.parse(data);
          console.log("DATA from connection", d)
        } catch(e) {
          console.error("Invalid message", data);
        }

      });
      this.connection = conn;
    });

    this.peer.on('open', (peerId) => {

        console.log("#################### peerjs", peerId);
    //    this.updateUserProp.emit({ peer:peerId });
    });


    Firebase.onAuthorized((user) => {

      firebase.database()
      .ref("/listener/"+user.uid)
      .on("child_added", (snapshot) => {        
        var listener = snapshot.val();

        console.log("LISTENER ADDED", listener);

        var call = this.peer.call( listener, this.stream);
        call.on('stream', function(_remoteStream) {
          // Show stream in some video/canvas element.
          console.log("----------_____! HAVE PEER STREAM");
        });

      });

    });

  }
  

  render() {
    return <div>
      Upstream
      </div>  }

}
