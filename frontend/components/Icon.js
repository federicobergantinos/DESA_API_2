import React from "react";
import * as Font from "expo-font";
import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import { Icon } from "galio-framework";

import walletConfig from "../assets/config/wallet.json";
const WalletExtra = require("../assets/font/wallet.ttf");
const IconWalletExtra = createIconSetFromIcoMoon(walletConfig, "WalletExtra");

class IconExtra extends React.Component {
  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({ WalletExtra: WalletExtra });
    this.setState({ fontLoaded: true });
  }

  render() {
    const { name, family, ...rest } = this.props;

    if (name && family && this.state.fontLoaded) {
      if (family === "WalletExtra") {
        return <IconWalletExtra name={name} family={family} {...rest} />;
      }
      return <Icon name={name} family={family} {...rest} />;
    }

    return null;
  }
}

export default IconExtra;
