import * as firebase from 'firebase'
require('@firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyB-ZOz4vHabCZUwIXBFBkIsKaNu0id9JZ8",
    authDomain: "wireless-library-cf74b.firebaseapp.com",
    databaseURL: "https://wireless-library-cf74b-default-rtdb.firebaseio.com",
    projectId: "wireless-library-cf74b",
    storageBucket: "wireless-library-cf74b.appspot.com",
    messagingSenderId: "390790830649",
    appId: "1:390790830649:web:431f3585fd689f13978be8"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();