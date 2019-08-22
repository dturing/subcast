import { Component, h, State } from '@stencil/core';

import Firebase from '../../services/firebase';
import firebase from 'firebase/app';

@Component({
  tag: 'firebase-auth',
  styleUrl: 'firebase-auth.scss',
  shadow: false
})
export class FirebaseAuth {

  @State() user: firebase.User;

  @State() showMenu: boolean = true;
  @State() loggedIn: boolean = false;
  @State() error: {code:string, message:string};

  private firebase = Firebase.init();

  componentDidLoad() {
    
    this.firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
      Firebase.user = user;
//        console.log("SET USER", user? user.isAnonymous?"anon":user.displayName : "none");

      if (!user) this.anonymousLogin();
      //this.googleLogin();
      else {
        Firebase.setUser(user);
      }
    });

  } 

  anonymousLogin() {
    firebase.auth().signInAnonymously().catch(error => {
      this.error = error;
    });
  }

  googleLogin() {
    let provider = new this.firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    this.firebase
      .auth()
      .signInWithRedirect(provider);
  }

  logout() {
    this.firebase.auth().signOut();
  }

  render() {
    if (!this.user) {
      return <div class="auth">...</div>
    } else if (this.user.isAnonymous) {
      return <div class="auth">
                <a class="button" onClick={ _e => this.googleLogin() }>[anon]</a>
             </div>
    } else {
      return <div class="auth">
               <a class="button" onClick={_e => this.logout() }>{ this.user.displayName || "[invalid]" }</a>

              
            </div>
    }
/*
    return <div class="authInfo">
            <div>
              <mdc-chip onRemoval={ _e => this.logout() } icon="face" trailingIcon="cancel" text={ this.user ? (this.user.isAnonymous ? "Anonymous" : this.user.displayName) : "Connecting..." } />
            </div>
      { this.error
          ? <div class="error"><br /><br />{this.error.message}</div>
          : <div />
      }
      
      </div>
      */
  }  
}

