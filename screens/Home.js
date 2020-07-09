import * as React from "react";
import TabNavigator from "../navigation/TabNavigator";

export default class Home extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };
  render() {
    return <TabNavigator />;
  }
}
