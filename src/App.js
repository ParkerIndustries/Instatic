import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import ImageUpload from './ImageUpload';
import { db, auth } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Input, Button } from "@material-ui/core";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 300,
    backgroundColor: theme.palette.background.default,
    borderRadius: 3,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10, 1, 10),
    margin: theme.spacing(0, 0, 0),
    outlineStyle: "none",
    outlineWidth: 0,
    outlineColor: "transparent",
  },
}));

var styleButton = { 
  backgroundColor: 'red',
  fontSize: 14,
  border: "none",
  background: "none",
  color: "#0095f6",
  fontWeight: "bold",
  margin: 20,
};

function App() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsuscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    })

    return () => {
      unsuscribe();
    }
  }, [user, username]);

  //Updates the page anytime the db has a new post.
  useEffect(() => {
    db.collection("posts").orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      });
    })
    .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));
    setOpenSignIn(false);

  })

  return (
    <div className="App">
      <Modal className="app__modal" open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerModal"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <input
              placeholder="Nom d'utilisateur"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button style={styleButton} onClick={signUp}>S'inscrire</Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button style={styleButton} onClick={signIn}>Se connecter</Button>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
          <div className="app__loginContainer">
            <button className="app__headerButton" type="button" onClick={() => auth.signOut()}>
              <strong>{user.displayName}/Déconnexion</strong>
            </button>
          </div>
        ) : (
          <div className="app__loginContainer">
          <button className="app__headerButton" type="button" onClick={() => setOpenSignIn(true)}>
            <strong>Se connecter</strong>
          </button>
          <button className="app__headerButton" type="button" onClick={() => setOpen(true)}>
            <strong>S'inscrire</strong>
          </button>
          </div>
        )}
        
      </div>
      {user ? (
      <div>
      {posts.map(({id, post}) => (
        <Post
          key={id}
          postId={id}
          user={user}
          username={post.username}
          caption={post.caption}
          imageURL={post.imageURL}
        />
      ))}</div>
      ) : (<div></div>)}
      {user ? (
      <ImageUpload username={user.displayName}/>
      ) : (
        <div><h3 className="app__visitors">Merci de vous connecter ou de vous inscrire pour poster ou commenter!</h3></div>
      )}
    </div>
  );
}

export default App;
