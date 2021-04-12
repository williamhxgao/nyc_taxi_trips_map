import React, { useState, useEffect } from "react";

export default function NYCDataReader(isGroup, swPosition, nePosition, positionType)
{   var result = [];
    //const [data, setData] = useState([]);
    
    //useEffect(() => {
        var startPosition = swPosition;
        var offset = {
            lat_offset : nePosition.lat - swPosition.lat,
            lng_offset : nePosition.lng - swPosition.lng
        };
        var params = startPosition.lng + "/" + offset.lng_offset + "/" + startPosition.lat + "/" + offset.lat_offset + "/" + positionType;
        console.log(params);
        var url = isGroup? "https://localhost:5001/api/TaxiTrips/groups/" +  params : "https://localhost:5001/api/TaxiTrips/" + params;
        console.log(url);
        fetch(url,
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
        .then(data => result = data);
      //});
      console.log(result);
    return result;
}