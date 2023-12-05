import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAvMA1Wryh0Sbq3T6SlMlpfHinwFzBl-BA",
  authDomain: "medselect-e1aec.firebaseapp.com",
  projectId: "medselect-e1aec",
  storageBucket: "medselect-e1aec.appspot.com",
  messagingSenderId: "271973218747",
  appId: "1:271973218747:web:48fb260edbf68285a9ac9e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export const signInWithGoogle = () => {

    signInWithPopup(auth,provider).then((result)=>{
        
        const name = result.user.displayName;
        const email = result.user.email;

        localStorage.setItem("name",name)
        localStorage.setItem("email",email)
        
    }).catch((error)=>{
        console.log(error)
    })
    
};

