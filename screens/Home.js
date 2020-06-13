import * as React from "react";
import TabNavigator from "../navigation/TabNavigator";
// import DrawerNavigator from "../navigation/DrawerNavigator";

export default class Home extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };
  render() {
    // return <DrawerNavigator />;
    return <TabNavigator />;
  }
}
