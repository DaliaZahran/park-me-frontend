// Another good updated input library
// https://www.npmjs.com/package/react-native-places-input
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { theme } from "../constants";
import { StyleSheet, Dimensions } from "react-native";

const width = Dimensions.get("window").width;
function MapInput(props) {
  return (
    <GooglePlacesAutocomplete
      onFail={(error) => console.error(error)}
      placeholder="Enter Destination"
      minLength={2} // minimum length of text to search
      autoFocus={true}
      returnKeyType={"search"} // Can be left out for default return key
      // returnKeyType={"default"}
      listViewDisplayed={"false"} // true/false/undefined
      fetchDetails={true}
      nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GooglePlacesSearchQuery={{
        rankby: "distance",
      }}
      filterReverseGeocodingByTypes={["locality"]}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        props.notifyChange(details.geometry.location);
      }}
      query={{
        key: "AIzaSyCIHTPJe-WWvww360Kfsjgd1KhD3Uc3ogg",
        language: "en",
        components: "country:eg",
      }}
      currentLocation={true}
      enablePoweredByContainer={true}
      debounce={10}
      styles={{
        textInputContainer: {
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#eee",
          elevation: 3,
          opacity: 0.95,
        },
        textInput: {
          color: "#5d5d5d",
          fontSize: 16,
        },
        listView: {
          backgroundColor: "white",
          borderRadius: 8,
          // flex: 1,
          elevation: 3,
          height: 200,
          opacity: 0.7,
          zIndex: 10,
        },
        description: {
          fontWeight: "bold",
        },
        predefinedPlacesDescription: {
          color: "#1faadb",
        },
      }}
    />
  );
}
export default MapInput;
