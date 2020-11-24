import { Input, Button } from '@material-ui/core'
import React, { useState } from 'react';
import { storage, db } from "./firebase";
import firebase from "firebase";
import './ImageUpload.css';

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                console.log("----1");
                console.log(image.name);
                console.log("----1");
                storage.ref("images/")
                .child(image.name)
                .getDownloadURL(url)
                .then(url => {
                    console.log("----2");
                    console.log(url);
                    console.log("----2");
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageURL: url,
                        username: username
                    });
                    console.log("Check this ", url);
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                    setUrl("");
                });
            }
        )
    }

    return (
        <div className="upload">
            <progress className="upload__progress" value={progress} max="100" />
            <Input type="text" placeholder='Description' onChange={event => setCaption(event.target.value)} value={caption}/>
            <Input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
