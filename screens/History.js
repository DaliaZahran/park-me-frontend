import * as React from "react";
import { Button, Block, Text, Card, Badge } from "../components";
import { theme } from "../constants";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default class History extends React.Component {
  render() {
    // const { profile, navigation } = this.props;
    // const tabs = ["Products", "Inspirations", "Shop"];
    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>
            Browse
          </Text>
          {/* <Button>
            <Image source={profile.avatar} style={styles.avatar} />
          </Button> */}
        </Block>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertial: theme.sizes.base * 2 }}
        >
          <TouchableOpacity
          // onPress={() => navigation.navigate("Explore", category)}
          >
            <Card center middle shadow style={styles.category}>
              <Badge>
                <Image source={require("../assets/images/logo.png")} />
              </Badge>
              <Text>Session 1</Text>
              <Text gray caption>
                Nile University
              </Text>
            </Card>
          </TouchableOpacity>
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  category: {
    // this should be dynamic based on screen width
    minWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxHeight: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
  },
});
