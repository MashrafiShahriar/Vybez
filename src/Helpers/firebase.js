import { message } from "antd";
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, getFirestore, deleteDoc, getDoc, updateDoc, addDoc } from "firebase/firestore"; 
import {deleteObject, getStorage, ref} from 'firebase/storage'
import { artist, playlists } from "./router";


const firebaseConfig = {
  apiKey: "AIzaSyBAjcuveCY5bkikDNEWf7naQciNV5M3x0g",
  authDomain: "vibez-d769b.firebaseapp.com",
  databaseURL: "https://vibez-d769b-default-rtdb.firebaseio.com",
  projectId: "vibez-d769b",
  storageBucket: "vibez-d769b.appspot.com",
  messagingSenderId: "607638068572",
  appId: "1:607638068572:web:134ae233ce041ad73c7599"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app)
const provider = new GoogleAuthProvider();


export const signUpWithEmailAndPass = (userObj) => {
    createUserWithEmailAndPassword(auth, userObj.email, userObj.password)
  .then((user) => {

    setDoc(doc(db, "artists", user.uid),  
    {image: user.photoURL,
        name: user.displayName,
        musics: [],
        like: 0,
        listen:0,
        totalPlayed:0});

   
    message.success("User Created")
    
  })
  .catch((error) => {
    const errorCode = error.code;
    message.error(errorCode)
    
  });
}

export const logout = ()=>{
    signOut(auth).then(() => {
        window.location = "login"
        message.info("Signed out")
      }).catch(() => {
      });    
}
export const loginWithEmailAndPassword = (email, password) => {
signInWithEmailAndPassword(auth, email, password)
.then(() => {
    window.location = "home"

    message.success("Logged in")
  // ...
})
.catch((error) => {
  const errorCode = error.code;
  message.error(errorCode)

});
}
// logout()
export const socialSignInWithGoogle = () => {
    signInWithPopup(auth, provider)
    .then((user) => {
      user = user.user
      getDoc(doc(db, "artists", user.uid)).then((c)=>{

        if(c.exists()){
          console.log("b")

          window.location = "home"
          message.success("Logged in")
        }else{

        console.log("c")

          setDoc(doc(db, "artists", user.uid),  
          {image: user.photoURL,
              name: user.displayName,
              musics: [],
              playlists:[],
              like: 0,
              listen:0,
              totalPlayed:0}).then(()=>{
                window.location = "home"
                message.success("Logged in")
              }).catch((err)=>{
                console.log(err.errorCode)
              })
        }
      })
 
    }).catch((error) => {
      const errorCode = error.code;
      console.log(error)
      message.error(errorCode)

    });
}



export const sendPasswordReset = (email) => {
    sendPasswordResetEmail(auth, email)
  .then(() => {
    message.info("Reset link sent!")

  })
  .catch((error) => {
    const errorCode = error.code;
    message.error(errorCode)

    // ..
  });
}


export const deletePlaylist = (pid) =>{

    getDoc(doc(db, "artists", artist.uid)).then((f)=>{
      console.log(f)
        let playlists = f.data().playlists
        playlists.splice(playlists.indexOf(pid),1)
        updateDoc(doc(db, "artists", artist.uid),{
            playlists: playlists
        }).then(()=>{
            deleteDoc(doc(db, "playlists", pid)).then(()=>{
                message.info("Playlist deleted")
                window.location.reload()
        }).catch(()=>{
            message.error("Could not delete playlist")
        })
        })
    })
}


export const deleteMusic = (pid, mid, path) => {
    message.loading("Deleting Music", 5)

    deleteObject(ref(storage, path)).then(() => {
        deleteDoc(doc(db, "playlists", pid, "songs", mid)).then(()=>{
      
            message.info("Music deleted")
                window.location.reload()
            }).catch(()=>{
        message.error("Could not delete music")
    })
      }).catch((error) => {
        // Uh-oh, an error occurred!
      });
  
}