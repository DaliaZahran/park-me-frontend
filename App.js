import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./navigation/index";
import { Block } from "./components";

// import all used images
const images = [
  require("./assets/icons/back.png"),
  require("./assets/images/avatar.png"),
  require("./assets/images/logo.png"),
];
export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };
  handleResourcesAsync = async () => {
    // we're caching all the images
    // for better performance on the app
    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  };
  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.handleResourcesAsync}
          onError={(error) => console.warn(error)}
          onFinish={() => this.setState({ isLoadingComplete: true })}
        />
      );
    }
    return (
      <NavigationContainer>
        <Block white>
          <Navigation />
        </Block>
      </NavigationContainer>
    );
  }
}
const styles = StyleSheet.create({});
