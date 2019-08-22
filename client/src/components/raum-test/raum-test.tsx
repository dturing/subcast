import { Component, h } from '@stencil/core';
import firebase from 'firebase/app';
import Firebase from '../../services/firebase';

@Component({
  tag: 'raum-test',
  styleUrl: 'raum-test.css',
  shadow: true
})
export class RaumTest {

  componentDidLoad() {
    console.log("RaumTest Load");
    Firebase.onAuthorized((user) => {
      console.log("Firebase authorized: ", user);

/*
      firebase.database()
      .ref("/signal/") //"+claims.org)
      firebase.database()
      .ref("/broadcast/odiho/") //"+claims.org)
      .on("value", (snapshot) => {
        var streams = snapshot.val();

        if (claims.stream) {
          this.stream = streams[claims.stream];
        } else {
          this.stream = streams[Object.keys(streams)[0]];
        }
      });
      */
    });
  }


  render() {
    return <div>RaumTest</div>
  }

}
