import React, { Component } from "react";
import { View, Image, Alert } from "react-native";
import { CheckBox } from "react-native-elements";

export default class spotsMap extends Component {
  state = {
    checked1: false,
  };

  pressHead() {
    this.setState({ checked1: !this.state.checked1 });
    Alert.alert("Pressed Head", "");
  }

  pressChest() {
    this.setState({ checked2: !this.state.checked2 });
    Alert.alert("Pressed Chest", "");
  }

  render() {
    return (
      <View style={{ width: 200, height: 600 }}>
        <Image
          style={{ width: 200, height: 600, resizeMode: "contain" }}
          source={require("../assets/images/slots.jpg")}
        />
        <CheckBox
          containerStyle={{
            position: "absolute",
            top: 22,
            right: 75,
            padding: 0,
          }}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checkedColor="#ff0000"
          checked={this.state.checked1}
          onPress={() => this.pressHead()}
        />
        <CheckBox
          containerStyle={{
            position: "absolute",
            top: 70,
            right: 75,
            padding: 0,
          }}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checkedColor="#ff0000"
          checked={this.state.checked1}
          onPress={() => this.pressChest()}
        />
      </View>
    );
  }
}
