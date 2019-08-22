import { Component, h } from '@stencil/core';


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true
})
export class AppRoot {

  render() {
    return (
      <div>
        <header>
          <firebase-auth/>
        </header>

        <main>
          <raum-test />
        </main>
      </div>
    );
  }
}
