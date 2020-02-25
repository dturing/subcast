import { Component, Prop, Watch, State, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'sc-preview',
  styleUrl: 'sc-preview.css',
  shadow: true
})
export class ScPreview {

  @Prop() width: number = 160;
  @Prop() height: number = 120;

  @State() canvas: HTMLCanvasElement;
  @State() photo: HTMLImageElement;

  @Prop() videoElement: HTMLVideoElement;


  @Event() updateUserProp: EventEmitter;


  @Watch("videoElement")
  haveVideoElement(_videoElement) {
  }

  componentDidLoad() {

    setTimeout(()=>{
      this.shootPreview();

      setInterval(()=>{
        this.shootPreview();
      }, 5000);

    }, 1000);

  }
  

  shootPreview() {
    var ctx = this.canvas.getContext("2d");
    ctx.drawImage(this.videoElement, 0, 0, this.width, this.height);

    var data = this.canvas.toDataURL('image/jpeg');
    //(console.log(data);
    this.photo.setAttribute('src', data);
    this.updateUserProp.emit({ preview: data });
  }

  render() {
    return <div>
        <canvas id="canvas" width={this.width} height={this.height} ref={(el) => this.canvas = el as HTMLCanvasElement} ></canvas>
        <img id="photo" width="160" height="120" ref={(el) => this.photo = el as HTMLImageElement} ></img>
      </div>
  }

}
