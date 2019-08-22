import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-404',
  styleUrl: 'app-404.css',
  shadow: true
})
export class App404 {

  render() {
    return <div class="404">
      404 nothing to see here
    </div>
  }
}
