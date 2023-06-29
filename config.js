import {getApps,getApp,initializeApp} from 'firebase/app';
import {getStorage} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBtFjbFbpM6qTmprD1Va500Zkqbf6jDB1M",
    authDomain: "expofirebase-14c19.firebaseapp.com",
    projectId: "expofirebase-14c19",
    storageBucket: "expofirebase-14c19.appspot.com",
    messagingSenderId: "105299560561",
    appId: "1:105299560561:web:53affc8677d7f08b4333d0"
  };

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);
export {app,storage};