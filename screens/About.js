import * as React from "react";
import { Block, Text } from "../components";
import { theme } from "../constants";

export default class About extends React.Component {
  render() {
    return (
      <Block
        padding={[theme.sizes.base * 1, theme.sizes.base * 2]}
        flex={0.5}
        margin={[theme.sizes.padding * 2, 0]}
      >
        <Text h1 bold>
          About
        </Text>
      </Block>
    );
  }
}
