import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { Block } from "../components";
import MapContainer from "../components/MapContainer";

export default class MapScreen extends React.Component {
  render() {
    return (
      <Block white>
        <View style={styles.container}>
          <MapContainer />
        </View>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
  },
});
