import { openImagePickerAsync } from "../../components/ImagePicker.js";
import React from "react";
import { TouchableOpacity, FlatList, View, Image } from "react-native";
import { Block, Text } from "galio-framework";
import { Images, walletTheme } from "../../constants";
import { theme } from "galio-framework";

import { yummlyTheme } from "../../constants/index.js";
import Icon from "../../components/Icon.js";
import Input from "../../components/Input.js";
import styles from "./HomeStyles.js";
import backendApi from "../../api/backendGateway";

const RenderMainInformation = () => {
  const BalanceSection = () => {
    return (
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Balance</Text>
        <Text style={styles.amountText}>107.23 USD</Text>
      </View>
    );
  };

  return (
    <Block
      flex
      style={[styles.HomeCard, { backgroundColor: walletTheme.COLORS.VIOLET }]}
    >
      <Block>
        <BalanceSection />
      </Block>
    </Block>
  );
};

export default RenderMainInformation;
