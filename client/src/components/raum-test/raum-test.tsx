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

    Firebase.onAuthorized((user) => {

      var userName = user.isAnonymous?"anon":user.displayName;
      console.log("Firebase authorized.", userName);

      var activePath = firebase.database().ref("/rebel/"+user.uid);

      activePath.onDisconnect().remove().then(()=>{

        if (navigator.geolocation) {
          navigator.geolocation.watchPosition((p) => {
            let t = { 
                t:p.timestamp,
                n:userName,
                lat:p.coords.latitude, lon:p.coords.longitude
              };
            console.log("- set geolocation", t);
            activePath.set(t);
          });
        } else {
          console.log("need geolocation");
        }

      });


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
    return <div><sc-preview /></div>
  }

}
