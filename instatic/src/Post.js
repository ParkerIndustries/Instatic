import React, { useEffect, useState } from 'react'
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import {db} from './firebase';

function Post({postId, username, caption, imageURL}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsuscribe;
        if (postId) {
            unsuscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            })
        }
        return () => {
            unsuscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        
    } 



    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt='MK' src="/static/images/avatar/1.jpg" />
                <h3>{username}</h3>
            </div>
            <img className="post__image" src={imageURL}/>
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            <form>
                <input className="post__input" type="text" placeholder="Ajouter un commentaire..." value={comment} onChange={(e) => setComment(e.target.value)}/>
                <button className="post__button" disabled={!comment} type="submit" onClick={postComment}>Publier</button>
            </form>
        </div>
    )
}

export default Post
