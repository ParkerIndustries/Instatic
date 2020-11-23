import './App.css';
import Post from './Post';

function App() {
  return (
    <div className="App">
      <div className="app__header">
         <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
      </div>
      <Post username="Mickael" caption="Description" imageURL="https://blog.uniclixapp.com/wp-content/uploads/2020/07/1-1-instagram-1024x1024-1-1.jpg"/>
      <Post username="Mickael" caption="Descriptio" imageURL="https://blog.uniclixapp.com/wp-content/uploads/2020/07/1-1-instagram-1024x1024-1-1.jpg"/>
      <Post username="Mickael" caption="Descripti" imageURL="https://blog.uniclixapp.com/wp-content/uploads/2020/07/1-1-instagram-1024x1024-1-1.jpg"/>
    </div>
  );
}

export default App;
