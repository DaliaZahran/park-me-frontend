import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createAppContainer } from "react-navigation";
import TabBarIcon from "../components/TabBarIcon";
import Map from "../screens/Map";
import Settings from "../screens/Settings";
import About from "../screens/About";
import History from "../screens/History";
import Stats from "../screens/Stats";
import More from "../screens/More";
// import { Map, Settings, About, History } from "../screens";

import DrawerNavigator from "../navigation/DrawerNavigator";

const Tab = createBottomTabNavigator();
function TabNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="Seach"
        component={Map}
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-map" />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          title: "History",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-contact" />
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={Stats}
        options={{
          title: "Stats",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-stats" />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-settings" />
          ),
        }}
      />
      {/* 
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-settings" />
          ),
        }}
      />
      
      <Tab.Screen
        name="About"
        component={About}
        options={{
          title: "About",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-information-circle" />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}

export default TabNavigator;
