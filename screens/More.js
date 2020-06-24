import * as React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { Block, Text } from "../components";
import { theme } from "../constants";
import Settings from "./Settings";
import About from "./About";
import Login from "./Login";

export default class More extends React.Component {
  render() {
    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold></Text>
        </Block>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <OptionButton
            icon="md-settings"
            label="Settings"
            onPress={() => this.props.navigation.navigate("Settings")}
          />

          <OptionButton
            icon="md-information-circle"
            label="About"
            onPress={() =>
              WebBrowser.openBrowserAsync("https://reactnavigation.org")
            }
          />

          <OptionButton
            icon="md-log-out"
            label="Sign Out"
            onPress={() => this.props.navigation.navigate("Login")}
            isLastOption
          />
        </ScrollView>
      </Block>
    );
  }
}

function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton
      style={[styles.option, isLastOption && styles.lastOption]}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={30} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    paddingHorizontal: theme.sizes.base * 2,
  },
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: "#ededed",
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 20,
    alignSelf: "flex-start",
    marginTop: 1,
  },
});
