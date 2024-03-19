import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import for Firebase Storage

const firebaseConfig = {
   apiKey: "AIzaSyAvMA1Wryh0Sbq3T6SlMlpfHinwFzBl-BA",
   authDomain: "medselect-e1aec.firebaseapp.com",
   projectId: "medselect-e1aec",
   storageBucket: "medselect-e1aec.appspot.com",
   messagingSenderId: "271973218747",
   appId: "1:271973218747:web:48fb260edbf68285a9ac9e"
};

class FirebaseSingleton {
   constructor() {
      if (!FirebaseSingleton.instance) {
         this.app = initializeApp(firebaseConfig);
         this.auth = getAuth(this.app);
         this.db = getFirestore(this.app);
         this.storage = getStorage(this.app); // Initialize Firebase Storage
         this.provider = new GoogleAuthProvider();
         FirebaseSingleton.instance = this;
      }
      return FirebaseSingleton.instance;
   }

   signInWithGoogle() {
      signInWithPopup(this.auth, this.provider)
         .then((result) => {
            const name = result.user.displayName;
            const email = result.user.email;
            const profilePic = result.user.photoURL;

            localStorage.setItem("name", name);
            localStorage.setItem("email", email);
            localStorage.setItem("profilePic", profilePic);
         })
         .catch((error) => {
            console.log(error);
         });
   }
}

const firebaseInstance = new FirebaseSingleton();
export const db = firebaseInstance.db;
export const auth = firebaseInstance.auth;
export const storage = firebaseInstance.storage; // Export the storage instance
export const signInWithGoogle = firebaseInstance.signInWithGoogle.bind(firebaseInstance);
export { createUserWithEmailAndPassword, signInWithEmailAndPassword };
