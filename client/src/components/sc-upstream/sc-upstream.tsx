import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'sc-upstream',
  styleUrl: 'sc-upstream.css',
  shadow: true
})
export class ScUpstream {

  @State() stream :MediaStream;
  @State() videoElement :HTMLVideoElement;
  
  componentWillLoad() {
  }

  componentDidLoad() {
    console.log("Trying to GetUserMedia");
    navigator.mediaDevices
      .getUserMedia({audio:true, video:{ facingMode:"environment" }})
      .then(stream => {
        console.log("I have a Stream:", stream);
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

        <sc-audioviz stream={this.stream}></sc-audioviz>
        <sc-preview videoElement={this.videoElement}></sc-preview>
      </div>
  }

}
