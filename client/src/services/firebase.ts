import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';

type Handler<E> = (event: E) => void;

class EventDispatcher<E> { 
    private handlers: Handler<E>[] = [];
    fire(event: E) { 
        for (let h of this.handlers)
            h(event);
    }
    register(handler: Handler<E>) { 
        this.handlers.push(handler);
    }
}

export default class Firebase {

	private static app;

	public static user: firebase.User;

	static init() {
	    var config = {
		    apiKey: "AIzaSyDmmHzLo4YR-ywmEhcMSYaQiKAa7VQYgq0",
		    authDomain: "subcast-001.firebaseapp.com",
		    databaseURL: "https://subcast-001.firebaseio.com",
		    projectId: "subcast-001",
		//    storageBucket: "",
		//    messagingSenderId: "1046582197096",
		    appId: "1:1046582197096:web:b438ef50045665f3"
	    };

		if (!Firebase.app) {
			Firebase.app = firebase.initializeApp(config);
		}

		return firebase;
	}

	static auth() {
		return firebase.auth();
	}

	static database() {
		return firebase.database();
	}

	static onAuthorizedHandler = new EventDispatcher<any>();
	static onAuthorized(f:Handler<any>) {
		Firebase.onAuthorizedHandler.register(f);
		if (Firebase.user) f(Firebase.user);
	}
	static setUser(user:any) {
		Firebase.user = user;
		Firebase.onAuthorizedHandler.fire(user);
	}

}
