import firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB0sfOqfJGdi9tXLBrm-FvARAxKrTTXEkM",
    authDomain: "trigramreacttuto.firebaseapp.com",
    projectId: "trigramreacttuto",
    storageBucket: "trigramreacttuto.appspot.com",
    messagingSenderId: "790017698312",
    appId: "1:790017698312:web:1a58645ffb11ef8ebcbfbd"  
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };
