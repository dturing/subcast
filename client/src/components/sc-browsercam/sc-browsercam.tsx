import { Component, State, h } from '@stencil/core';
//import Peer from 'peerjs';

@Component({
  tag: 'sc-browsercam',
  styleUrl: 'sc-browsercam.css',
  shadow: true
})
export class ScBrowserCam {

  @State() stream :MediaStream;
  @State() videoElement :HTMLVideoElement;

//  private peer:Peer;
//  private connection;
  
  componentWillLoad() {
  }

  componentDidLoad() {
/*
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
    });


*/

    console.log("Trying to GetUserMedia", navigator.mediaDevices);
    navigator.mediaDevices
      .getUserMedia({audio:true, video:{ facingMode:"environment" }})
      .then(stream => {
        console.log("I do have a Stream:", stream);
        this.stream = stream;

        const videoTracks = stream.getVideoTracks();
        console.log(`Using video device: ${videoTracks[0].label}`);

        this.videoElement.srcObject = stream;
        this.videoElement.volume = 0;

        stream.getTracks().forEach(_track => {
//          var hack = pc as any;
//          hack.addTrack(track, stream);
        });

        //createOffer();

      })
      .catch(e => {
        console.log("getUserMedia error:", e.name);
      });
  }
  

  render() {
    return <div>
        <video autoplay playsinline ref={(el) => this.videoElement = el as HTMLVideoElement}/>

        <sc-upstream stream={this.stream}></sc-upstream>

        <sc-audioviz stream={this.stream}></sc-audioviz>
        <sc-preview videoElement={this.videoElement}></sc-preview>

        <sc-geolocation />
        <sc-userprop name="foo" value="bar"/>
        <sc-userprop name="rate" value={50} type="rate"/>
      </div>
  }

}
