import { Component, State, h } from '@stencil/core';
/*
import firebase from 'firebase/app';
import Firebase from '../../services/firebase';
*/

@Component({
  tag: 'sc-preview',
  styleUrl: 'sc-preview.css',
  shadow: true
})
export class ScPreview {

  videoElement :HTMLVideoElement;
  
  @State() audioContext: AudioContext;
  @State() audioSource: AudioNode;
  analyser: AnalyserNode;

  @State() freqs: Uint8Array;
  @State() times: Uint8Array;
  @State() size: number = 128;

  spectrumBar = [];

  @State() canvas: HTMLCanvasElement;
  @State() overlayCanvas: HTMLCanvasElement;


  @State() photo: HTMLImageElement;


  componentWillLoad() {
    this.audioContext = new AudioContext();
    this.freqs = new Uint8Array(this.size);
    this.times = new Uint8Array(this.size);

  }

  componentDidLoad() {
    console.log("Try to GetUserMedia");
    navigator.mediaDevices
      .getUserMedia({audio:true, video:{ facingMode:"environment" }})
      .then(stream => {
        console.log("I have a Stream:", stream);

        const videoTracks = stream.getVideoTracks();
        console.log(`Using video device: ${videoTracks[0].label}`);
        this.videoElement.srcObject = stream;
        this.videoElement.volume = 0;

        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length>0) {
          console.log("Using Audio device", audioTracks[0].label);
          if (this.audioContext) this.audioContext.resume();

          this.analyser = this.audioContext.createAnalyser();
          this.analyser.smoothingTimeConstant = 0.8;
          this.analyser.fftSize = this.size;

          this.audioSource = this.audioContext.createMediaStreamSource(stream);
          this.audioSource.connect(this.analyser);

//    requestAnimationFrame(this.draw.bind(this));
          var ctx = this.canvas.getContext("2d");
          var width = 40;
          var height = 30;
          this.canvas.width = width;
          this.canvas.height = height;

          var octx = this.overlayCanvas.getContext("2d");

          var peak = 0;

          setInterval(()=>{
            this.analyser.getByteFrequencyData(this.freqs)
            peak = Math.max.apply( null, this.freqs );
            this.spectrumBar[0].style.width = ""+peak+"px";

            this.analyser.getByteTimeDomainData(this.times);

            // draw scope
              octx.clearRect(0,0,this.overlayCanvas.width,this.overlayCanvas.height);
              octx.beginPath()

              var widthFactor = this.overlayCanvas.width/this.size;
              var heightFactor = 1;
              var yOffset = this.overlayCanvas.height/2;
              for (let i = 0; i < this.size; i++) {
                const x = i*widthFactor;
                const y = yOffset + (this.times[i]-128)*heightFactor; //*f(i/this.size);
                if (i == 0) {
                  octx.moveTo(x, y)
                } else {
                  octx.lineTo(x, y);
                }
              }
          
              octx.strokeStyle = "white";
              octx.lineWidth = 1;
              octx.stroke();


          }, 50);

          setInterval(()=>{
            ctx.drawImage(this.videoElement, 0, 0, width, height);

            var data = this.canvas.toDataURL('image/png');
//            console.log(data);
            this.photo.setAttribute('src', data);

          }, 1000);

        }
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
        <div id="feed">
          <video autoplay playsinline ref={(el) => this.videoElement = el as HTMLVideoElement}/>
          <canvas id="overlay" width="160" height="120" ref={(el) => this.overlayCanvas = el as HTMLCanvasElement} ></canvas>
        </div>

        <div class="spectrum">
          <div ref={(el) => this.spectrumBar[0] = el as HTMLElement }></div>
          <div ref={(el) => this.spectrumBar[1] = el as HTMLElement }></div>
          <div ref={(el) => this.spectrumBar[2] = el as HTMLElement }></div>
          <div ref={(el) => this.spectrumBar[3] = el as HTMLElement }></div>
          <div ref={(el) => this.spectrumBar[4] = el as HTMLElement }></div>
        </div>

        <canvas id="canvas" width="160" height="120" ref={(el) => this.canvas = el as HTMLCanvasElement} ></canvas>
        <img id="photo" width="160" height="120" ref={(el) => this.photo = el as HTMLImageElement} ></img>

      </div>
  }

}
