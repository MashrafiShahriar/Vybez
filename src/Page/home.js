import { Button, Card, Divider, Form, Image, Input, List, message, Modal, Popconfirm, Select, Typography, Upload } from "antd"
import ButtonGroup from "antd/es/button/button-group"
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useEffect, useState } from "react"
import { db, deletePlaylist, logout, storage, deleteMusic } from "../Helpers/firebase"
import { artist, dx, musics, playlists, userObj } from "../Helpers/router"
import UploadOutlined from '@mui/icons-material/UploadOutlined';
import { Box, Stack } from "@mui/material"


 const Home = () => {
    const [isModalOpen , setisModalOpen] = useState(false)
    const [isMusicModalOpen , setIsMusicModalOpen] = useState(false)
    const [isModalOpenXX , setIsModalOpenXX] = useState(false)
    const [mualimsc , setmualimsc] = useState({})
    const [xIlk , setXIlk] = useState({})
    const [mualimscss , setmualimscss] = useState({})
    const [mualimscxx , setmualimscxx] = useState({})
    
    const handleCancel = ()=>{
setisModalOpen(false)
}
    const handleOk = ()=>{
setisModalOpen(false)
}
    const handleCancelXX = ()=>{
        setIsModalOpenXX(false)
}
    const handleOkXX = ()=>{
        setIsModalOpenXX(false)
}
    const handlexCancel = ()=>{
        setIsMusicModalOpen(false)
}
    const handlexOk = ()=>{
        setIsMusicModalOpen(false)
}

    return(<>
    <center>
        <br></br>
        <Image src={artist.photoURL} width={"10%"}  style={{borderRadius:"50%"}}/>
    <h1 style={{color:"#1976D2", fontWeight:"normal"}}>{artist.displayName}</h1>
    <Stack direction="row" alignItems="center" justifyContent="center" sx={{my:3}}>
                <Box sx={{mx:2}}>
                    <Typography variant="h1" color="primary">{userObj&&userObj.totalPlayed}</Typography>
                    <Typography variant="caption">Music Played</Typography>
                </Box>
                <Box sx={{mx:2}}>
                    <Typography variant="h1" color="primary">{userObj && userObj.listen}</Typography>
                    <Typography variant="caption">Listener</Typography>
                </Box>
                <Box sx={{mx:2}}>
                    <Typography variant="h1" color="primary">{userObj && userObj.like}</Typography>
                    <Typography variant="caption">Likes</Typography>
                </Box>
            </Stack>
<Divider></Divider>
    <ButtonGroup variant="text" aria-label="text button group">
        <Button type="primary" onClick={()=>{setIsMusicModalOpen(true)}}>+ Music</Button>
        <Modal title="Add music" open={isMusicModalOpen} onOk={handlexOk} onCancel={handlexCancel}>
        <Form
layout="horizontal"
onFinish={(values)=>{     
    
        message.loading("Uploading music", 20)
           uploadBytes(ref(storage,`songs/${mualimscxx.name}`),mualimscxx.originFileObj).then(async (music)=>{
           uploadBytes(ref(storage,`/images/${mualimscss.name}`),mualimscss.originFileObj).then((image)=>{
            getDownloadURL(ref(storage,image.ref.fullPath)).then((url)=>{
              getDownloadURL(ref(storage,music.ref.fullPath)).then(async (musicurl)=>{
                addDoc(collection(db, "playlists", values.playlist, 'songs'), {
                  artist: artist.displayName,
                    description : values.description,
                    title:values.title,
                    cover: url,
                    music: musicurl,
                    genre: values.genre,
                    uid: artist.uid,
                    musicPath:`songs/${mualimscxx.name}`,
                    albumPath: `images/${mualimscss.name}`
                }).then(()=>{
                  message.info("Music added")
                  window.location.reload()
                }).catch(()=>{
                  message.error("Error adding music")
                });
              })
            })
           })
            
           })



}}
>
<Form.Item name='title' label="Title">
  <Input />
</Form.Item>
<Form.Item name='description' label="Description">
  <Input />
</Form.Item>
<Form.Item name='genre' label="Genre">
<Select
        style={{
          width: 200,
        }}
        options={[
            {
                label: "Hipco",
                value: "Hipco"
            },
            {
                label: "Traditional",
                value: "Traditional"
            },
            {
                label: "Gbema",
                value: "Gbema"
            },
            {
                label: "Gospel",
                value: "Gospel"
            },
            {
                label: "Trapco",
                value: "Trapco"
            },
            {
                label: "RnB/Afro soul",
                value: "RnB/Afro soul"
            },
            {
                label: "Raggae Dancehall",
                value: "Raggae Dancehall"
            },
            {
                label: "Afro  Dance",
                value: "Afro  Dance"
            },
            {
                label: "Hip-Hop",
                value: "hip-hop"
            },
            {
                label: "Afrobeat",
                value: "Afrobeat"
            },
            {
                label: "Jazz",
                value: "Jazz"
            },
            {
                label: "Amapiano",
                value: "Amapiano"
            },
        ]}
      />
</Form.Item>
<Form.Item name='playlist' label="Playlist">
<Select
        style={{
          width: 200,
        }}
        options={dx}
      />
</Form.Item>
<Form.Item label="Cover">
<Upload name="Cover" action="/" listType="picture" onChange={(e)=>{
                setmualimscss(e.file)
               } } >
    <Button icon={<UploadOutlined />}>Click to upload</Button>
  </Upload>

</Form.Item>
<Form.Item label="Music">
<Upload name="music" action="/" listType="picture" onChange={(e)=>{
                setmualimscxx(e.file)
               } } >
    <Button icon={<UploadOutlined />}>Click to upload</Button>
  </Upload>

</Form.Item>


   <center> <Button htmlType='submit'>Add</Button></center>


</Form>
      </Modal>
        <Button onClick={()=>{setisModalOpen(true)}}>+ Playlist</Button>
        <Modal title="New playlist" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      
<Form

layout="horizontal"

onFinish={(values)=>{
    message.loading("Creating playlist", 20)

    uploadBytes(ref(storage,`playlistcovers/${Math.random()}/${mualimsc.name}`),mualimsc.originFileObj).then((cover)=>{
        getDownloadURL(ref(storage,cover.ref.fullPath)).then(o=>{
          async function f(){
            const docRef = await addDoc(collection(db, "playlists"), {
              title: values.title,
              description: values.description,
              cover: o,
              uid: artist.uid,
              artist: artist.displayName,
            });
            getDoc(doc(db, "artists", artist.uid)).then((ddz)=>{
                let fcx = ddz.data().playlists
                fcx.push(docRef.id)
                updateDoc(doc(db, "artists", artist.uid), {
                  playlists: fcx
                }).then(()=>{
                  setisModalOpen(false)
                  window.location.reload()
                  message.info("Playlist added")
                }).catch(()=>{
                  message.error("Error adding playlist")
                });
            })
          }
          f()
        })
      })
}}
>
<Form.Item name='title' label="Title">
  <Input />
</Form.Item>
<Form.Item name='description' label="Description">
  <Input />
</Form.Item>
<Form.Item label="Cover">
<Upload name="Cover" action="/" listType="picture" onChange={(e)=>{
                setmualimsc(e.file)
               } } >
    <Button icon={<UploadOutlined />}>Click to upload</Button>
  </Upload>
</Form.Item>


   <center> <Button htmlType='submit'>Add</Button></center>


</Form>
      </Modal>
        {/* <Button>Profile</Button> */}
        <Popconfirm
    title="Are you sure to log out?"
    onConfirm={()=>{logout()}}
    okText="Yes"
    cancelText="No"
  >
    <Button style={{backgroundColor:"#ff000099", color:"#ffffff"}}>Logout</Button>
  </Popconfirm>
        
      </ButtonGroup>
    </center>
    <Divider><h1>My Playlists</h1></Divider>
    <List
    grid={{
      gutter: 16,
      xs: 1,
      sm: 2,
      md: 5,
      lg: 6,
      xl: 6,
      xxl: 6,
    }}
    dataSource={playlists}
    renderItem={(item) => (
        <List.Item>
        <Card hoverable  cover={<img alt="cover" src={item.cover} />} title={item.title}>
            <h5>Artist: {item.artist} <br></br>Description: {item.description}</h5>
            <Divider></Divider>
        <center>    <ButtonGroup variant="text" aria-label="text button group">
        <Popconfirm
    title="Are you sure to delete this item?"
    onConfirm={()=>{  deletePlaylist(item.id)}}
    okText="Yes"
    cancelText="No"
    >
    <Button style={{backgroundColor:"#ff000099", color:"#ffffff"}} >Delete</Button>
  </Popconfirm>
        
      </ButtonGroup></center>
        </Card>
      </List.Item>
    )}
    />
 <Divider><h1>My Musics</h1></Divider>

 <List 
        grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 5,
            lg: 6,
            xl: 6,
            xxl: 6,
          }}
       dataSource={musics}
       renderItem={(music) => (
        <List.Item>
             <Card hoverable  cover={<img alt="cover" src={music.cover} />} title={music.title}>
            <h5>Artist: {music.artist} <br></br>Album: {music.album}</h5>
            <Divider></Divider>
        <center>    <ButtonGroup variant="text" aria-label="text button group">
        <Popconfirm
    title="Are you sure to delete this item?"
    onConfirm={()=>{  deleteMusic(music.albumId, music.id, music.musicPath)}}
    okText="Yes"
    cancelText="No"
    >
    <Button style={{backgroundColor:"#ff000099", color:"#ffffff"}} >Delete</Button>
  </Popconfirm>
        
      </ButtonGroup></center>
        </Card>
        </List.Item>
       )}
       />


    </>)
 }
 

 export default Home



