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

const RenderMainInformation = ({ showBalance, toggleBalanceVisibility }) => {
  return (
    <Block flex style={styles.balanceContainer}>
      <Text style={styles.balanceText}>Balance</Text>
      <Text style={styles.amountText}>
        {showBalance ? "107.23 USD" : "***"}
      </Text>
      <TouchableOpacity
        onPress={toggleBalanceVisibility}
        style={styles.visibilityIcon}
      >
        <Icon
          name={showBalance ? "eye" : "eye-off"}
          family="Feather"
          size={20}
          color={walletTheme.COLORS.WHITE}
        />
      </TouchableOpacity>
    </Block>
  );
};

export default RenderMainInformation;
