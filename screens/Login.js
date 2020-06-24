import React, { Component } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";

import { Button, Block, Input, Text } from "../components";
import { theme } from "../constants";

// const VALID_EMAIL = "admin";
// const VALID_PASSWORD = "123";
const VALID_EMAIL = "";
const VALID_PASSWORD = "";

export default class Login extends Component {
  static navigationOptions = {
    headerTitle: "",
  };
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false,
  };
  handleLogin() {
    const { navigation } = this.props;
    const { email, password } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      navigation.navigate("Home");
    }
    if (email !== VALID_EMAIL) {
      errors.push("email");
    }
    if (password !== VALID_PASSWORD) {
      errors.push("password");
    }

    this.setState({ errors, loading: false });

    // if (!errors.length) {
    //   navigation.navigate("Home");
    // }
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null);

    return (
      <KeyboardAvoidingView
        style={styles.login}
        // behavior={Platform.OS === "ios" ? "padding" : null}
        behavior="height"
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
      >
        <Block padding={[theme.sizes.base * 1.5, theme.sizes.base * 2]}>
          <Text h1 bold>
            Login
          </Text>
          <Block middle>
            <Input
              label="Email"
              error={hasErrors("email")}
              style={[styles.input, hasErrors("email")]}
              defaultValue={this.state.email}
              onChangeText={(text) => this.setState({ email: text })}
            />
            <Input
              secure
              label="Password"
              error={hasErrors("password")}
              style={[styles.input, hasErrors("password")]}
              defaultValue={this.state.password}
              onChangeText={(text) => this.setState({ password: text })}
            />
            <Button gradient onPress={() => this.handleLogin()}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text bold white center>
                  Login
                </Text>
              )}
            </Button>

            <Button
              onPress={() => navigation.navigate("Forgot")}
              style={{ backgroundColor: "transparent" }}
            >
              <Text
                gray
                caption
                center
                style={{ textDecorationLine: "underline" }}
              >
                Forgot your password?
              </Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  login: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  },
});
