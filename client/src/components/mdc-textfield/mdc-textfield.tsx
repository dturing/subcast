import { Component, h, Element, Prop } from '@stencil/core';
import { MDCTextField } from '@material/textfield/index';
import { MDCLineRipple } from '@material/line-ripple/index';

@Component({
  tag: 'mdc-textfield',
  styleUrl: 'mdc-textfield.scss',
  shadow: false
})
export class TextfieldComponent {

  @Element() el: HTMLElement;


  @Prop() eid: string;
  @Prop() label: string;
  @Prop({ mutable: true }) value: string;
  @Prop() type: string = 'text';
  @Prop() maxWidth: string;

/*
  @Event() valuechange: EventEmitter;
  @Listen("input")
  onInput( e ) {
    console.log("input", e.target.value);
    this.value = e.target.value;
  }
  @Listen("change")
  onChange( e ) {
    console.log("inner change", e.target.value);
    this.value = e.target.value;
    this.valuechange.emit(e.target.value);
  }
*/

  componentDidLoad() {
    var txtField = this.el.querySelector('.mdc-text-field');
    var lineRipple = this.el.querySelector('.mdc-line-ripple');
    new MDCTextField(txtField);
    new MDCLineRipple(lineRipple);
  }

  render() {
    const styling = {
      'max-width': this.maxWidth
    };
    return (
      <div class="mdc-text-field" style={styling}>
        <input type={this.type} id={this.eid} class="mdc-text-field__input" step="any" value={this.value} />
        <label class="mdc-floating-label" htmlFor={this.eid}>{this.label}</label>
        <div class="mdc-line-ripple"></div>
      </div>
    );
  }
}
