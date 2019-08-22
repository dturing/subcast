import { Component, h, Element, Prop, Event, EventEmitter } from '@stencil/core';
import {MDCChipSet} from '@material/chips';

@Component({
  tag: 'mdc-chip',
  styleUrl: 'mdc-chip.scss',
  shadow: true
})
export class ChipComponent {

  @Element() el: HTMLElement;

  @Prop() text: string;
  @Prop() icon: string;
  @Prop() trailingIcon: string;

  @Event() removal: EventEmitter;

  componentDidLoad() {
    var chipSetEl = this.el.shadowRoot.querySelector('.mdc-chip-set');
    new MDCChipSet(chipSetEl);
    chipSetEl.addEventListener("MDCChip:removal", e => {
      this.removal.emit((e as CustomEvent).detail);
    });
  }

  render() {
    const icon = () => {
      return this.icon ? <i class="material-icons mdc-chip__icon mdc-chip__icon--leading">{this.icon}</i> : null;
    };
    const trailingIcon = () => {
      return this.trailingIcon ? <i class="material-icons mdc-chip__icon mdc-chip__icon--trailing">{this.trailingIcon}</i> : null;
    };

    return (
      <div class="mdc-chip-set">
        <div class="mdc-chip">
          {icon()}
          <div class="mdc-chip__text">{this.text || ''}</div>
          {trailingIcon()}
        </div>
      </div>
    );
  
  }
}
