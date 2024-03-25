import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  View,
  ActivityIndicator,
} from "react-native";
import { Block, theme } from "galio-framework";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Card } from "../components";
import backendApi from "../api/backendGateway";
import { SearchBar } from "../components/SearchBar";
import Tabs from "../components/Tabs";
import tabs from "../constants/tabs";
import walletTheme from "../constants/Theme";

const { width, height } = Dimensions.get("screen");

const Home = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [allItemsLoaded, setAllItemsLoaded] = useState(false);
  const [endReachedThreshold, setEndReachedThreshold] = useState(0.1); // Valor inicial

  const navigation = useNavigation();
  const route = useRoute();
  const tabId = route.params?.tabId;

  useEffect(() => {
    setSelectedTag(tabId);
    setData([]);
    setCurrentPage(0);
    setAllItemsLoaded(false);
  }, [tabId]);

  useEffect(() => {
    fetchRecipes();
  }, [selectedTag, currentPage]);

  const fetchRecipes = async () => {
    if (loading || allItemsLoaded) return;

    setLoading(true);
    try {
      const page = currentPage;

      const tag = selectedTag !== "ALL" ? selectedTag : undefined;
      const { response: recipes } = await backendApi.recipesGateway.getAll(
        page,
        tag
      );

      if (recipes.length > 0) {
        setData((prevData) => [...prevData, ...recipes]);
      } else {
        setAllItemsLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreItems = () => {
    if (!loading && !allItemsLoaded) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator
          animating
          size="large"
          color={walletTheme.COLORS.GRADIENT_START}
        />
      </View>
    );
  };

  const renderRecipe = ({ item, index }) => {
    const marginRight = index % 2 === 0 ? theme.SIZES.BASE : 0;
    return (
      <Card
        item={item}
        style={{
          marginRight: marginRight,
          width: (width - theme.SIZES.BASE * 3) / 2,
        }}
      />
    );
  };

  return (
    <Block flex style={styles.home}>
      <Block flex row={false}>
        <Block style={styles.header}>
          <Block style={{ flexDirection: "row", alignItems: "center" }}>
            <Block flex={1}>
              <SearchBar></SearchBar>
            </Block>
          </Block>
          <Tabs
            data={tabs}
            initialIndex={tabs[0].id}
            onChange={(id) => navigation.setParams({ tabId: id })}
          />
        </Block>
        <Block center style={{ height: "80%" }}>
          <FlatList
            data={data}
            renderItem={renderRecipe}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.recipes}
            onEndReached={loadMoreItems}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            numColumns={2}
          />
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  home: {
    height: height,
    width: "100%",
  },
  recipes: {
    width: width - theme.SIZES.BASE,
    paddingVertical: 5,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 20,
    bottom: 20,
    backgroundColor: "white",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  fabIcon: {
    fontSize: 24,
    color: "#333",
  },
  header: {
    paddingHorizontal: 10,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
});

export default Home;
