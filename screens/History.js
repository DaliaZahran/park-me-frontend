import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import { Card, Badge, Button, Block, Text } from "../components";
import { theme, mocks } from "../constants";

const { width } = Dimensions.get("window");

class History extends Component {
  state = {
    active: "All",
    categories: [],
  };

  componentDidMount() {
    this.setState({ categories: this.props.categories });
  }

  handleTab = (tab) => {
    const { categories } = this.props;
    if (tab === "All") {
      this.setState({ active: tab, categories: categories });
    } else {
      const filtered = categories.filter((category) =>
        category.tags.includes(tab.toLowerCase())
      );

      this.setState({ active: tab, categories: filtered });
    }
  };

  renderTab(tab) {
    const { active } = this.state;
    const isActive = active === tab;

    return (
      <TouchableOpacity
        key={`tab-${tab}`}
        onPress={() => this.handleTab(tab)}
        // onPress={() => this.setState({ active: tab })}
        style={[styles.tab, isActive ? styles.active : null]}
      >
        <Text size={16} medium gray={!isActive} secondary={isActive}>
          {tab}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { profile, navigation } = this.props;
    const { categories } = this.state;
    const tabs = ["All", "Past", "Current"];

    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>
            History
          </Text>
          <Button onPress={() => navigation.navigate("Settings")}>
            <Image source={profile.avatar} style={styles.avatar} />
          </Button>
        </Block>

        <Block flex={false} row style={styles.tabs}>
          {tabs.map((tab) => this.renderTab(tab))}
        </Block>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base * 2 }}
        >
          <Block flex={false} row space="between" style={styles.categories}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.sessionId}
                onPress={() => navigation.navigate("About", { category })}
              >
                <Card middle shadow style={styles.category}>
                  <Badge
                    //   margin={[0, 0, 15]}
                    style={{
                      position: "absolute",
                      right: 40,
                    }}
                    size={70}
                    color="rgba(41,216,143,0.2)"
                  >
                    <Text color={"#e71414"} bold title size={32}>
                      £{category.fees}
                    </Text>
                  </Badge>
                  <Text title height={20}>
                    {category.name}
                  </Text>
                  <Text gray caption>
                    {category.address}
                  </Text>
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: "row",
                    }}
                  >
                    <Text bold color={"rgba(41, 216, 143, 0.9)"} size={16}>
                      {category.startTime} - {category.endTime}
                    </Text>
                    <Text bold size={14} style={{ marginLeft: 30 }}>
                      {category.date}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </Block>
        </ScrollView>
      </Block>
    );
  }
}

History.defaultProps = {
  profile: mocks.profile,
  categories: mocks.sessions,
};

export default History;

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2,
  },
  tabs: {
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2,
  },
  tab: {
    marginRight: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base,
  },
  active: {
    borderBottomColor: theme.colors.secondary,
    borderBottomWidth: 3,
  },
  categories: {
    flexWrap: "wrap",
    paddingHorizontal: theme.sizes.base * 1,
    marginBottom: theme.sizes.base * 3.5,
  },
  category: {
    // this should be dynamic based on screen width
    minWidth: width - theme.sizes.padding * 1.2,
    maxWidth: width - theme.sizes.padding * 1.2,
    maxHeight: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
  },
});
