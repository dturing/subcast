import { Component, Listen, h } from '@stencil/core';
import firebase from 'firebase/app';
import Firebase from '../../services/firebase';

@Component({
  tag: 'raum-test',
  styleUrl: 'raum-test.css',
  shadow: true
})
export class RaumTest {

  activePath:firebase.database.Reference;
  userProps = {};

  @Listen("updateUserProp")
  handleUpdateUserProp( e:CustomEvent ) {
//    console.log("updateUserProp", e.detail);
    Object.assign(this.userProps, e.detail);
    if (this.activePath) this.activePath.set(this.userProps);
  }

  componentDidLoad() {

    Firebase.onAuthorized((user) => {

      var userName = user.isAnonymous?"anon":user.displayName;
      console.log("Firebase authorized.", userName);

      this.activePath = firebase.database().ref("/feed/"+user.uid);

      this.activePath.onDisconnect().remove().then(()=>{

        Object.assign(this.userProps, { 
          n:userName,
          t:firebase.database.ServerValue.TIMESTAMP
        });

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
    return <div>
        <sc-viewer />
        <sc-browsercam />

      </div>
  }

}
