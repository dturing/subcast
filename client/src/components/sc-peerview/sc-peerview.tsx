import { Component, Prop, State, Watch, h } from '@stencil/core';
import Peer from 'peerjs';
import firebase from 'firebase/app';
import Firebase from '../../services/firebase';

@Component({
  tag: 'sc-peerview',
  styleUrl: 'sc-peerview.css',
  shadow: true
})
export class ScPeerView {

  @Prop() feed = undefined;
  @Prop() peerId = undefined;
  @Prop() feedId = undefined;

  @State() myPeerId = undefined;

  @State() videoElement :HTMLVideoElement;

  activePath:firebase.database.Reference;
/*
  @Watch("peerId")
  havePeerId(id) {
    console.log("peerview has id:", id);

    var call = this.peer.call( id, null);
    call.on('stream', function(_remoteStream) {
      // Show stream in some video/canvas element.
      console.log("----------_____! HAVE PEER STREAM");
    });
  }
  */

  @Watch("feedId")
  haveFeedId(feedId) {
    console.log("peerview has id:", feedId);

    this.register(feedId, Firebase.user.uid);;
/*
    var call = this.peer.call( id, null);
    call.on('stream', function(_remoteStream) {
      // Show stream in some video/canvas element.
      console.log("----------_____! HAVE PEER STREAM");
    });
    */
  }


  private peer:Peer;
  
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
        console.log("VIEW PEER ERROR", err);
      });

      this.peer.on('open', (peerId) => {

          console.log("#################### peerview peerjs", peerId);
          this.myPeerId = peerId;

          if (this.feedId) this.register(this.feedId, Firebase.user.uid);
  //        this.updateUserProp.emit({ peer:peerId });
      });

      this.peer.on('call', (call) => {
        call.on('stream', (stream) => {
           console.log("HAVE REMOTE STREAM", stream);
           this.videoElement.srcObject = stream;
           this.videoElement.play();
        });
        call.answer(null);
        /*
        getUserMedia({video: true, audio: true}, function(stream) {
          call.answer(stream); // Answer the call with an A/V stream.
          call.on('stream', function(remoteStream) {
            // Show stream in some video/canvas element.
          });
        }, function(err) {
          console.log('Failed to get local stream' ,err);
        });
        */
      });

  }

  register(feedId:string, userId:string) {

      if (this.activePath) {
        this.activePath.set(null);
      }
      console.log("register peer", this.myPeerId, "feed", feedId, "user", userId);
      
      this.activePath = firebase.database().ref("/listener/"+feedId+"/"+userId);

      this.activePath.onDisconnect().remove().then(()=>{
            this.activePath.set(this.myPeerId);
      });
  }

  render() {
  
    return <div>
          <video autoplay playsinline ref={(el) => { console.log("-------- HAVE VIDEO EL"); this.videoElement = el as HTMLVideoElement; }}/>
          <div>{this.feed.n}</div>
          <div>
              {this.feed.key}
              {this.feed.rate ? " | rate "+this.feed.rate : "" } 
              {this.feed.lat ? " | geo "+this.feed.lat+"/"+this.feed.lon : ""} 
          </div>

      </div>
  }
}
