import { Result } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { root } from '..';
import Home from '../Page/home';
import SignIn from '../Page/login';
import SignUp from '../Page/signup';
import { auth, db } from './firebase';

export let artist = {}
export let playlists = []
export let musics = []
export let dx = []
export let userObj = {}

const router = () => {

    rootRender(<><Result
        subTitle="Loading"
      /></>)
    const path = window.location.pathname
const PA = path.split("/")
PA.splice(0,1)
    
    let rootPath = PA[0].toLowerCase()
    console.log(rootPath)

    onAuthStateChanged(auth, (user) => {
        if (user) {
            artist = user
            getDoc(doc(db, "artists", user.uid)).then((k)=>{
                    userObj = k.data()
                switch(rootPath){
                    case "home":
                        HomeF()
                        break;
                        case "":
                            HomeF()
                            break;
                            default:
                                rootRender()
                                break;
                            }
                        })
        } else {
            switch(rootPath){
                case "login":
                    rootRender(<SignIn/>)
                break;
                case "register":
                      rootRender(<SignUp/>)
                break;
        
                default:
                    rootRender(<SignIn/>)
                break;
            }
        }
      });

}

const HomeF = ()=>{

    getDoc(doc(db, "artists", artist.uid)).then((f)=>{
        let pll = f.data().playlists

        if(f.data().playlists.length > 0){
            playlists = []
            pll.forEach(element => {
               getDoc(doc(db, "playlists", element)).then((g)=>{
                let x = g.data()
                x.id = element
                   playlists.push(x)
                   
    if(playlists.length === f.data().playlists.length){
    }
                    HomeM()
               })
            });
        }else{
            rootRender(<Home/>)
        }

   })
 
}

const rootRender = (dom) =>{
    root.render(
        <React.StrictMode>
          {dom}
        </React.StrictMode>
      );
}


const HomeM = () =>{
    var itemsProcessed = 0;

    playlists.forEach(d=>{
        dx.push({
            label: d.title,
            value: d.id
        })
})
        playlists.forEach(x=>{
              getDocs(collection(db, "playlists", x.id, "songs")).then((s)=>{
           if(s.docs.length !== 0){
            s.docs.forEach((o, i, a)=>{
                let q = o.data()
                q["albumId"] = x.id
                q["album"] = x.title
                q["id"] = o.id
                musics.push(q)  
                itemsProcessed++;
                if(itemsProcessed === s.docs.length) {
                    
                    rootRender(<Home/>)
                }
            })
           }else{
            rootRender(<Home/>)
           }
           
        })

        })
}

export default router