import { Component, Prop, Watch, State, h } from '@stencil/core';

@Component({
  tag: 'sc-audioviz',
  styleUrl: 'sc-audioviz.css',
  shadow: true
})
export class ScAudioVisualizer {

  @Prop() stream :MediaStream;

  @State() audioContext: AudioContext;
  @State() audioSource: AudioNode;
  analyser: AnalyserNode;

  @State() times: Uint8Array;
  @State() size: number = 128;

  @State() canvas: HTMLCanvasElement;

  componentWillLoad() {
    this.audioContext = new AudioContext();
    this.times = new Uint8Array(this.size);
  }

  @Watch("stream")
  haveStream(stream) {
    console.log("AudioViz has Stream:", stream);

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
      var octx = this.canvas.getContext("2d");

      setInterval(()=>{

        this.analyser.getByteTimeDomainData(this.times);

        // draw scope
        octx.clearRect(0,0,this.canvas.width,this.canvas.height);
        octx.beginPath()

        var widthFactor = this.canvas.width/this.size;
        var heightFactor = 1;
        var yOffset = this.canvas.height/2;
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

      }, 1000/25);
    }
  }
  

  render() {
    return <div>
        <canvas id="overlay" width="100" height="100" ref={(el) => this.canvas = el as HTMLCanvasElement} ></canvas>
      </div>
  }

}
