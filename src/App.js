import * as React from 'react';
import {Map, Marker, Popup} from 'react-map-gl';
import './app.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import RoomIcon from '@mui/icons-material/Room';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Topbar from './components/Topbar';

function App() {
  const user = React.useState({})
  const [currentUsername,setCurrentUsername] = React.useState(user)
  const [viewState, setViewState] = React.useState({
    center: [0, 0],
        zoom: 0.7,
  });
  //create and display ideas
  const [newIdea, setNewIdea] = React.useState(null);
  const [idea, setIdea] = React.useState([]);
  const [currentIdeaId, setCurrentIdeaId] = React.useState(null);

 //ideas content
 const [title, setTitle] = React.useState(null); 
 const [category, setCategory] = React.useState(0); 
 const [desc, setDesc] = React.useState(null); 
 const [materials, setMaterials] = React.useState(null);
 const [instructions, setInstructions] = React.useState(null);

 //signup&login
 const [showSignUp, setShowSignUp] = React.useState(false);
 const [showLogin, setShowLogin] = React.useState(false);

   //Marker click
   const handleMarkerClick = (id,long,lat) => {
    setCurrentIdeaId(id);
    setViewState({...viewState, longitude:long, latitude:lat})//centrar
  };

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat.toArray();
    setNewIdea({
      long,
      lat,
    });
  };

  //fetch ideas from DB
  React.useEffect(() =>{
    const getIdeas = async () =>{
      try {
        const res = await axios.get("https://map-app-backend.herokuapp.com/ideas/all");
        setIdea(res.data);
      } catch (error) {
        console.log(error)
      }
    };
    getIdeas()
  },[])

  //create new marker
  const handleSubmit = async (e)=>{
    e.preventDefault();
    const newMarker = {
      user:currentUsername,
      title,
      category,
      desc,
      materials,
      instructions,
      long:newIdea.long,
      lat:newIdea.lat,
    };
    try {
      const res = await axios.post("https://map-app-backend.herokuapp.com/ideas/create/", newMarker)
      setIdea([...idea, res.data]);
      setNewIdea(null);
    } catch (err) {
      console.log(err);
    }
  };

  return( 
    <div className='App'>
    <Map
    {...viewState}
    onMove={evt => setViewState(evt.viewState)}
    style={{ width: "100vw", height: "100vh" }}
    mapStyle="mapbox://styles/mapbox/streets-v11"
    mapboxAccessToken={process.env.REACT_APP_TOKEN}
    onDblClick = {handleAddClick}
  > 
    {idea.map((i) => (
        < >
        <Topbar/>
          <Marker
            longitude={i.long}
            latitude={i.lat}
            anchor="bottom"
            color="blue">
            <RoomIcon
              style={{ color: i.username === currentUsername ? "red" : "slateblue", cursor: "pointer" }}
              onClick={() => handleMarkerClick(i._id, i.long,i.lat)} />
          </Marker>
          {i._id === currentIdeaId && (
            <Popup
              longitude={i.long}
              latitude={i.lat}
              anchor="left"
              closeButton={true}
              closeOnClick={false}
              onClose={() => setCurrentIdeaId(null)}>
              <div className='idea'>
                <label>Title </label>
                <h4 className='title'> {i.title}</h4>
                <label>Category </label>
                <p>{i.category}</p>
                <label className='desc'>Description</label>
                <p>{i.desc}</p>
                <label className='materials'>Materials</label>
                <p>{i.materials}</p>
                <label className='instructions'>Instructions </label>
                <p>{i.instructions}</p>
                <label className='FavoriteIcon'>Likes </label>
                <FavoriteIcon className='likes' /> <p>{i.likes}</p>
                <span className='username'>Created by <b>{i.username}</b></span>
              </div>
            </Popup>
          )}
        </>
      ))}
      {newIdea && (
        <Popup
          longitude={newIdea.long}
          latitude={newIdea.lat}
          anchor="left"
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewIdea(null)}
          >
         <div>
          <form onSubmit={handleSubmit}>
          <label>Title </label>
          <input placeholder='Give a distinctive name to your idea!' onChange={(e)=>setTitle(e.target.value)}></input>
          <label>Category </label>
          <select onChange={(e)=>setCategory(e.target.value)}>
            <option value="1">Arts</option>
            <option value="2">Sports</option>
            <option value="3">History</option>
            <option value="4">Geography</option>
            <option value="5">Social Studies</option>
            <option value="6">Food</option>
          </select>
          <label>Description </label>
          <textarea placeholder='How does this idea relate to this country?' onChange={(e)=>setDesc(e.target.value)}></textarea>
          <label>Materials </label>
          <textarea placeholder='What do we need to recreate this?' onChange={(e)=>setMaterials(e.target.value)}></textarea>
          <label>Instructions </label>
          <textarea placeholder='How do we do it?'onChange={(e)=>setInstructions(e.target.value)}></textarea>
          <button className="submitButton" type="submit">Add idea</button>
          </form> 
         </div>
        </Popup>
      )}
      {currentUsername ? (
      <button className="button logout" > Log out
      </button>
      ) : (
         <div className='buttons'>
         <button className="button login" onClick={()=>setShowLogin(true)}> Login</button>
         <button className="button signup" onClick={()=>setShowSignUp(true)}>Sign up</button>
         </div>
      )}
      {showSignUp &&  <SignUp setShowSignUp={setShowSignUp}/>}
      {showLogin && (
      <Login 
      setShowLogin={setShowLogin}
      setCurrentUsername={setCurrentUsername}
      />
      )}  
      </Map>
  </div>
  );
}

export default App;
