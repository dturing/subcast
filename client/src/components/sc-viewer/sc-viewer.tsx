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

  @State() feeds = [];
  @State() feedsById = {};

  @State() activeFeed:string = undefined;
  
  componentWillLoad() {
    Firebase.onAuthorized((user) => {

      var userName = user.isAnonymous?"anon":user.displayName;
      console.log("Firebase authorized.", userName);

      firebase.database()
      .ref("/feed/")
      .on("value", (snapshot) => {        
        var feeds = snapshot.val();

        var fs = [];
        for (let key in feeds) {
          var f = feeds[key];
          f.key = key;
          fs.push(f);
        }
        this.feeds = fs;
        this.feedsById = feeds;
      });

    });
  }

  componentDidLoad() {
  }
  

  render() {
  
    return <div id="sc-viewer">

       {this.feeds.map((feed) =>
        <div key={feed.key}>
          <div>{feed.n}</div>
          <img id="photo" width="160" height="120" src={feed.preview} onClick={_e => { this.activeFeed = feed.key; }}></img>
        </div>
      )}

       {this.activeFeed 
         ? <div>
             <sc-peerview feed={this.feedsById[this.activeFeed]} feedId={this.feedsById[this.activeFeed].key} />
           </div>
         : ""
       }

      </div>
  }
}
