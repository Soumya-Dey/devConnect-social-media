import firebase from "firebase";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAYeDj0WC4ijjarmyeG2ZzAjS-81F1NqCU",
    authDomain: "devconnect-social-media.firebaseapp.com",
    databaseURL: "https://devconnect-social-media.firebaseio.com",
    projectId: "devconnect-social-media",
    storageBucket: "devconnect-social-media.appspot.com",
    messagingSenderId: "581815297859",
    appId: "1:581815297859:web:2fa303622fb6ef313871f6",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const projectStorage = firebase.storage();

export { projectStorage };
