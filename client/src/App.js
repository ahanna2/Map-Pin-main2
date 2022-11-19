import React, { useEffect, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";
import "./Components/Register"
import "./Components/Login"
// import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';

const App = () => {
  const myStorage = window.localStorage
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useEffect([]);
  const [currentPlaceId, setCurrentPlace] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [rating, setRating] = useState(0);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "50vh",
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });
  // conecting the backend to the frontend & adding the pins
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlace(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    const [long, lat] = e.lnglat;
    setNewPlace({
      lat,
      long,
    });
  };

  //  a new object to send to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = ()=>{
    myStorage.removeItem(user)
    setCurrentUser(null)
  }
  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle="mapbox://styles/alanhanna/clanagqx2000215p7ejfm6ebm"
        onDblClick={handleAddClick}
        transitionDuration="200"
      >
        {pins.map((p) => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-viewport.zoom * 3.5}
              offsetTop={-viewport.zoom * 7}
            >
              <Room
                style={{
                  fontSize: viewport.zoom * 7,
                  color: p.username === currentUser ? "red" : " blue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlace(null)}
              >
                <div className="card">
                  <lable className="Lable">Place</lable>
                  <h4 className="Place"> {p.title}</h4>
                  <lable className="Lable">Review</lable>
                  <p className="desc">{p.desc}</p>
                  <lable className="Lable">Rating</lable>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <lable className="Lable">Information</lable>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>title</label>
                <input
                  placeholder="Enter a title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="Review...."
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
          )}
          {currentUser ? (<button className="button logout" onClick={handleLogout}>Log out</button>) 
            : (
            <div className="buttons">
              <button className="button login" onClick={() => setShowLogin(true)}>Login</button>
              <button className="button register"onClick={() => setShowRegister(true)}>Register</button>   
            </div>
          )}
        {showRegister && <Register setShowRegister={setShowRegister}/>}
        {showLogin && <login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>}
      </ReactMapGL>
    </div>
  );
};

export default App;
