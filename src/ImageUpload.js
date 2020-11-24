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

    var styleButton = { 
        backgroundColor: 'red',
        fontSize: 14,
        border: "none",
        background: "none",
        color: "#0095f6",
        fontWeight: "bold",
    };

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
                storage.ref("images/")
                .child(image.name)
                .getDownloadURL(url)
                .then(url => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageURL: url,
                        username: username,
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        )
    }

    return (
        <div>
            <div className="upload fixed">
                <progress className="upload__progress" value={progress} max="100" />
                <input className="upload__text" type="text" placeholder='Description' onChange={event => setCaption(event.target.value)} value={caption}/>
                <input className="upload__file" type="file" onChange={handleChange} />
                <Button style={styleButton} onClick={handleUpload}>Upload</Button>
            </div>
            <div className="upload space">
                <progress className="upload__progress" value={progress} max="100" />
                <input className="upload__text" type="text" placeholder='Description' onChange={event => setCaption(event.target.value)} value={caption}/>
                <input className="upload__file" type="file" onChange={handleChange} />
                <Button style={styleButton} onClick={handleUpload}>Upload</Button>
            </div>
        </div>
    )
}

export default ImageUpload
