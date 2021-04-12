import React, {Component, useState} from "react";
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from "react-google-maps";
import NYCTripsReader  from "./NYCTripsReader"

//require('dotenv').config();


function Map(){

  const[data, setDate] = useState([]);

  const [selectedMark, setSelectedMark] = useState(null);

  let map = null;

  return(
    <GoogleMap 
      ref={m => {map = m;}}
      defaultZoom={15} 
      defaultCenter={{lat:40.712776, lng:-74.005974}} 
      onTilesLoaded={
        () =>{

        }
        
      }
      onZoomChanged={
        () =>{
            var sw = {lat: map.getBounds().getSouthWest().lat(),lng: map.getBounds().getSouthWest().lng()};
            var ne = {lat: map.getBounds().getNorthEast().lat(),lng: map.getBounds().getNorthEast().lng()};
            console.log("sw" + sw.lat + ";" + sw.lng);
            console.log("ne" + ne.lat + ";" + ne.lng);  

            fetch("https://localhost:5001/api/TaxiTrips/groups/" + sw.lng + "/" + (ne.lng - sw.lng) + "/" + sw.lat + "/" + (ne.lat - sw.lat) + "/PickUp" ,
              {
                  method:"get",
                  headers:{
                     'Accept': 'application/json',
                     'crossDomain':'true',
                     'Content-Type': 'application/json',
                     'Pragma': 'no-cache'
                 }
              })
         .then(response => response.json())
         .then(data => setDate(data));
          console.log(data);
        }
      }
    >
      
      {data.map(data =>{
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
      })}

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
          <div>
              <h2>Taxi Trips Group {selectedMark.id}</h2>
              <p>Average Passenger Count: {selectedMark.average_passenger_count}</p>
              <p>Average Trip Distance: {selectedMark.average_distance}</p>
              <p>Average Total Amount: {selectedMark.average_total_amount}</p>
          </div>
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
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDJzAI78dN-O6L8XUyVnAbCoEkiDF-rPSk`}
        loadingElement={<div style={{height:"100%"}}/>} 
        containerElement={<div style={{height:"100%"}}/>} 
        mapElement={<div style={{height:"100%"}}/>} 
      />
    </div>
  );
  
 
}


