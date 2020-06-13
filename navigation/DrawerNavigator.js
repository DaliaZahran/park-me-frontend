import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import TabNavigator from "../navigation/TabNavigator";
import Settings from "../screens/Settings";
import About from "../screens/About";
import Map from "../screens/Map";

function Tab() {
  return <TabNavigator />;
}

const Drawer = createDrawerNavigator();
function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Tab} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="About" component={About} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
