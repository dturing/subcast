import { Component, Prop, Watch, State, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'sc-preview',
  styleUrl: 'sc-preview.css',
  shadow: true
})
export class ScPreview {

  @Prop() width: number = 40;
  @Prop() height: number = 30;

  @State() canvas: HTMLCanvasElement;
  @State() photo: HTMLImageElement;

  @Prop() videoElement: HTMLVideoElement;


  @Event() updateUserProp: EventEmitter;


  @Watch("videoElement")
  haveVideoElement(videoElement) {
    console.log("ScPreview has videoElement:", videoElement);

    var ctx = this.canvas.getContext("2d");

    setInterval(()=>{
      ctx.drawImage(videoElement, 0, 0, this.width, this.height);

      var data = this.canvas.toDataURL('image/jpeg');
      //(console.log(data);
      this.photo.setAttribute('src', data);
      this.updateUserProp.emit({ preview: data });

    }, 1000);

        
  }
  

  render() {
    return <div>
        <canvas id="canvas" width={this.width} height={this.height} ref={(el) => this.canvas = el as HTMLCanvasElement} ></canvas>
        <img id="photo" width="160" height="120" ref={(el) => this.photo = el as HTMLImageElement} ></img>
      </div>
  }

}
