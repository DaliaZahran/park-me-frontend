import React from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import MapInput from "../components/MapInput";
import MyMapView from "../components/MapView";
import {
  getLocation,
  geocodeLocationByName,
} from "../services/location-service";
import { mocks } from "../constants";

const API = "http://192.168.1.17:8080/api/parking";
class MapContainer extends React.Component {
  state = {
    region: {},
    // parkings: mocks.parkings,
    parkings: {},
    lots: {},
  };

  getLots = (id) => {
    fetch(API + "/lots/" + id, {
      method: "get",
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("SUCCESSSS!");
          return response.json();
        } else {
          console.log(response.json());
          console.log("ERRORRRR!");
          return undefined;
        }
      })
      .then((data) => {
        let result = data.values;
        console.log(result);
        this.setState({ lots: result });
      })
      .catch((err) => {
        throw err;
      });
  };

  getAll = () => {
    fetch(API + "/locations", {
      method: "get",
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("SUCCESSSS!");
          return response.json();
        } else {
          console.log(response.json());
          console.log("ERRORRRR!");
          return undefined;
        }
      })
      .then((data) => {
        let result = data.values;
        // console.log(result);
        this.setState({ parkings: result });
      })
      .catch((err) => {
        throw err;
      });
  };

  componentDidMount() {
    this.getInitialState();
    this.getAll();
    this.getLots("001001");
  }

  getInitialState() {
    getLocation().then((data) => {
      console.log(data);
      this.setState({
        region: {
          latitude: data.latitude,
          longitude: data.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        },
      });
    });
  }

  getCoordsFromName(loc) {
    this.setState({
      region: {
        latitude: loc.lat,
        longitude: loc.lng,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
    });
  }

  onMapRegionChange(region) {
    this.setState({ region });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.region["latitude"] ? (
          <View style={{ flex: 1 }}>
            <MyMapView
              region={this.state.region}
              onRegionChange={(reg) => this.onMapRegionChange(reg)}
              markers={this.state.parkings}
            />
          </View>
        ) : null}
        <View style={styles.searchBox}>
          <MapInput notifyChange={(loc) => this.getCoordsFromName(loc)} />
        </View>
      </View>
    );
  }
}

export default MapContainer;

const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  searchBox: {
    position: "absolute",
    width: width - 20,
    zIndex: 9999,
    top: 30,
    marginHorizontal: 10,
  },
  marker: {
    left: "50%",
    marginLeft: -24,
    marginTop: -48,
    position: "absolute",
    top: "50%",
  },
});
