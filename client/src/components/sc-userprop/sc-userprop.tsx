import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'sc-userprop',
  styleUrl: 'sc-userprop.css',
  shadow: true
})
export class ScUserProperty {

  @Prop() name: string = "_";
  @Prop() type: string = "string";
  @Prop({mutable:true}) value: any = "";

  @Event() updateUserProp: EventEmitter;

  componentDidLoad() {
  }

  update(value) {
    this.value = value;

    var v = {}; v[this.name] = value;
    this.updateUserProp.emit(v);
  }

  renderByType() {
    switch (this.type) {
      case "rate":
        return <input type="range" min="1" max="100" onChange={ e => { var t:any = e.target; this.update(t.value); }} value={ this.value }></input>
      default:
        return <input class="editable" type="text" onChange={ e => { var t:any = e.target; this.update(t.value); }} value={ this.value }></input>
    }
  }

  render() {
    return [
        <div> Userprop : {this.name}: {JSON.stringify(this.value)} </div>
      ,
        this.renderByType()
      ]
  }

}
