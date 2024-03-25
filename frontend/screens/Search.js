import React from "react";
import {
  Animated,
  Dimensions,
  FlatList, // Cambiado de ScrollView a FlatList
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { Block, Text, Input, theme } from "galio-framework";
import { Icon, Card } from "../components/";
import backendApi from "../api/backendGateway"; // Asegúrate de tener esta API configurada para buscar recetas

const { width } = Dimensions.get("screen");
const ITEMS_PER_PAGE = 6; // Define cuántos elementos quieres cargar por página

export default class Search extends React.Component {
  state = {
    results: [],
    search: "",
    active: false,
    currentPage: 0,
    loading: false,
    allItemsLoaded: false,
  };

  animatedValue = new Animated.Value(0);

  // Actualizado para manejar la carga de datos
  componentDidMount() {
    this.fetchSearchResults();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.search !== this.state.search ||
      prevState.currentPage !== this.state.currentPage
    ) {
      this.fetchSearchResults();
    }
  }

  fetchSearchResults = async () => {
    const { search, currentPage } = this.state;
    if (this.state.loading || this.state.allItemsLoaded) return;

    this.setState({ loading: true });
    try {
      const { response, statusCode } =
        await backendApi.recipesGateway.searchRecipes(
          search,
          currentPage,
          ITEMS_PER_PAGE,
        );
      if (response && response.length > 0) {
        this.setState((prevState) => ({
          results:
            currentPage === 0 ? response : [...prevState.results, ...response],
          allItemsLoaded: response.length < ITEMS_PER_PAGE,
        }));
      } else {
        this.setState({ allItemsLoaded: true });
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSearchChange = (search) => {
    this.setState({ search, currentPage: 0, allItemsLoaded: false }); // Resetea la paginación con cada nueva búsqueda
  };

  loadMoreItems = () => {
    if (!this.state.loading && !this.state.allItemsLoaded) {
      this.setState((prevState) => ({
        currentPage: prevState.currentPage + 1,
      }));
    }
  };

  animate() {
    this.animatedValue.setValue(0);

    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  renderSearch = () => {
    const { search } = this.state;
    const iconSearch = search ? (
      <TouchableWithoutFeedback onPress={() => this.setState({ search: "" })}>
        <Icon
          size={16}
          color={theme.COLORS.MUTED}
          name="magnifying-glass"
          family="entypo"
        />
      </TouchableWithoutFeedback>
    ) : (
      <Icon
        size={16}
        color={theme.COLORS.MUTED}
        name="magnifying-glass"
        family="entypo"
      />
    );

    return (
      <Input
        right
        color="black"
        autoFocus={true}
        autoCorrect={false}
        autoCapitalize="none"
        iconContent={iconSearch}
        defaultValue={search}
        style={[styles.search, this.state.active ? styles.shadow : null]}
        placeholder="Que estas buscando?"
        onFocus={() => this.setState({ active: true })}
        onBlur={() => this.setState({ active: false })}
        onChangeText={this.handleSearchChange}
      />
    );
  };

  renderResult = (result) => {
    const opacity = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={{ width: width - theme.SIZES.BASE * 2, opacity }}
        key={`result-${result.title}`}
      >
        <Card item={result} horizontal />
      </Animated.View>
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    return (
      <Block flex center style={styles.searchContainer}>
        <Block center style={styles.header}>
          {this.renderSearch()}
        </Block>
        <FlatList
          data={this.state.results}
          renderItem={({ item }) => this.renderResult(item)}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          onEndReached={this.loadMoreItems}
          onEndReachedThreshold={0.5}
          ListFooterComponent={this.renderFooter}
        />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  searchContainer: {
    width: width,
    paddingHorizontal: theme.SIZES.BASE,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE,
    borderWidth: 1,
    borderRadius: 3,
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 2,
    zIndex: 2,
  },
  result: {
    backgroundColor: theme.COLORS.WHITE,
    marginBottom: theme.SIZES.BASE,
    borderWidth: 0,
  },
  resultTitle: {
    flex: 1,
    flexWrap: "wrap",
    paddingBottom: 6,
  },
  resultDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  image: {
    overflow: "hidden",
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
  },
  dealsContainer: {
    justifyContent: "center",
    paddingTop: theme.SIZES.BASE,
  },
  deals: {
    backgroundColor: theme.COLORS.WHITE,
    marginBottom: theme.SIZES.BASE,
    borderWidth: 0,
  },
  dealsTitle: {
    flex: 1,
    flexWrap: "wrap",
    paddingBottom: 6,
  },
  dealsDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageHorizontal: {
    overflow: "hidden",
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
  },
  imageVertical: {
    overflow: "hidden",
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },
});
