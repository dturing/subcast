import { Component, Prop, State, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'sc-geolocation',
  styleUrl: 'sc-geolocation.css',
  shadow: true
})
export class ScGeolocation {

  @State() lat: number;
  @State() lon: number;

  @Prop() path: string;

  @Event() updateUserProp: EventEmitter;

  

  componentDidLoad() {
    this.registerForUpdates();
  }

  registerForUpdates() {
    if (navigator.geolocation) {
      console.log("register geolocation updates")
      navigator.geolocation.watchPosition((p) => {
        console.log("geolocation update", p)
        this.lat = p.coords.latitude;
        this.lon = p.coords.longitude;
        this.updateUserProp.emit({ lat:p.coords.latitude, lon:p.coords.longitude });
      });
    } else {
      console.log("need geolocation");
    }
  }

  render() {
    return <div onClick={_ev => this.registerForUpdates()}>
      Geolocation : {this.lat} {this.lon}
      </div>
  }

}
