import React from "react";
import MapView, { Marker } from "react-native-maps";

const MyMapView = (props) => {
  return (
    <MapView
      style={{ flex: 1 }}
      region={props.region}
      showsUserLocation={true}
      // onRegionChange={(reg) => props.onRegionChange(reg)}
    >
      <Marker coordinate={props.region} />
      {props.markers.map((marker) => (
        <Marker
          key={marker.UUID}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.pName}
          description={`Parking Lot Status: ${
            marker.status === "0" ? "Empty" : "Busy"
          }`}
          pinColor={marker.status === "0" ? "green" : "red"}
        ></Marker>
      ))}
    </MapView>
  );
};
export default MyMapView;
