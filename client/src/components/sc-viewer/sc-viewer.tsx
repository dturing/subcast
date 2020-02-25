import { Component, State, h } from '@stencil/core';
//import Peer from 'peerjs';
import firebase from 'firebase/app';
import Firebase from '../../services/firebase';

@Component({
  tag: 'sc-viewer',
  styleUrl: 'sc-viewer.css',
  shadow: true
})
export class ScViewer {

  @State() feeds = {};
  
  componentWillLoad() {
    Firebase.onAuthorized((user) => {

      var userName = user.isAnonymous?"anon":user.displayName;
      console.log("Firebase authorized.", userName);

      firebase.database()
      .ref("/feed/") //"+claims.org)
      .on("value", (snapshot) => {        
        var feeds = snapshot.val();

        var fs = [];
        for (let key in feeds) {
          var f = feeds[key];
          f.key = key;
          fs.push(f);
        }
        this.feeds = fs;
      });

    });
  }

  componentDidLoad() {
  }
  

  render() {
//    VIEWER { JSON.stringify(this.feeds); }
  
    return <div id="sc-viewer">

       {this.feeds.map((feed) =>
        <div key={feed.key}>
          <div>{feed.n}</div>
          <img id="photo" width="160" height="120" src={feed.preview}></img>
        </div>
      )}

      </div>
    }
  }

}
