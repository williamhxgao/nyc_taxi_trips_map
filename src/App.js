import React, {useState} from "react";
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from "react-google-maps";
import NYCTripsReader from "./NYCTripsReader";

function Map(){

  let map = null; 
  
  var DataFetch = NYCTripsReader;

  const[isGroup, setIsGroup] = useState(true);
  
  const[data, setDate] = useState([]);

  const [selectedMark, setSelectedMark] = useState(null);

  

  return(
    <GoogleMap 
      ref={m => {map = m;}}
      defaultZoom={15} 
      defaultCenter={{lat:40.712776, lng:-74.005974}} 
      onTilesLoaded={
        () =>{
          var sw = {lat: map.getBounds().getSouthWest().lat(),lng: map.getBounds().getSouthWest().lng()};
          var ne = {lat: map.getBounds().getNorthEast().lat(),lng: map.getBounds().getNorthEast().lng()}; 
          DataFetch(isGroup, sw, ne, "PickUp").then(data => setDate(data));
        }
        
      }
      onZoomChanged={
        () =>{
            var sw = {lat: map.getBounds().getSouthWest().lat(),lng: map.getBounds().getSouthWest().lng()};
            var ne = {lat: map.getBounds().getNorthEast().lat(),lng: map.getBounds().getNorthEast().lng()}; 
            setIsGroup(map.getZoom() < 20)
            DataFetch(isGroup, sw, ne, "PickUp").then(data => setDate(data));
        }
      }
    >
      
      { isGroup?
        data.map(data =>{
          return(
          <Marker 
            position={{
              lat:data.centre_pickup_latitude,
              lng:data.centre_pickup_longitude
            }}
            onClick={() =>{
              setSelectedMark(data);
            }}
          />);
        }):
        data.map(data =>{
          return(
          <Marker 
            position={{
              lat:data.pickup_latitude,
              lng:data.pickup_longitude
            }}
            onClick={() =>{
              setSelectedMark(data);
            }}
          />);
        })
      }

      {selectedMark && (
        <InfoWindow
        position={{
          lat: selectedMark.centre_pickup_latitude,
          lng: selectedMark.centre_pickup_longitude
        }} 
        onCloseClick={() => {
          setSelectedMark(null);
        }}
        >
          {
            isGroup?
            <div>
                <h2>Taxi Trips Group: {selectedMark.id}</h2>
                <p>Number of Trips: {selectedMark.trips}</p>
                <p>Average Passenger Count: {selectedMark.average_passenger_count}</p>
                <p>Average Trip Distance: {selectedMark.average_distance}</p>
                <p>Average Total Amount: {selectedMark.average_total_amount}</p>
            </div>:
            <div>
            <h2>Taxi Trip {selectedMark.id}</h2>
            <p>assenger Count: {selectedMark.passenger_count}</p>
            <p>Trip Distance: {selectedMark.trip_distance}</p>
            <p>Total Amount: {selectedMark.total_amount}</p>
        </div>
          }
        </InfoWindow>
      )}
    </GoogleMap>
  );

  
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default function App() {
  
  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <WrappedMap 
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
        loadingElement={<div style={{height:"100%"}}/>} 
        containerElement={<div style={{height:"100%"}}/>} 
        mapElement={<div style={{height:"100%"}}/>} 
      />
    </div>
  );
  
 
}


