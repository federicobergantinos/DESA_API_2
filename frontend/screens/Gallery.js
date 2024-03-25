import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Animated,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview"; // Importa WebView
import { Block, theme } from "galio-framework";
import { HeaderHeight } from "../constants/utils";

const { width } = Dimensions.get("window");

export default class Gallery extends React.Component {
  scrollX = new Animated.Value(0);

  getYouTubeEmbedUrl = (url) => {
    // Extrae el ID del video de la URL
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[7].length == 11 ? match[7] : false;

    // Retorna la URL de incrustación
    return `https://www.youtube.com/embed/${videoId}`;
  };

  renderGallery = () => {
    const { route } = this.props;
    const { images } = route.params;

    return (
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        decelerationRate={0}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: this.scrollX } } }],
          { useNativeDriver: false }
        )}
      >
        {images.map((image, key) => {
          if (image.toLowerCase().includes("youtube")) {
            const embedUrl = this.getYouTubeEmbedUrl(image);
            return (
              <WebView
                key={`gallery-video-${key}`}
                style={{ width, height: width }}
                source={{ uri: embedUrl }}
                allowsFullscreenVideo={true}
              />
            );
          } else {
            return (
              <Image
                key={`gallery-image-${key}`}
                resizeMode="contain"
                source={{ uri: image }}
                style={{ width, height: width }}
              />
            );
          }
        })}
      </ScrollView>
    );
  };

  renderProgress = () => {
    const { navigation, route } = this.props;

    const { images, index } = route.params;
    const position = Animated.divide(this.scrollX, width);
    return (
      <Block row>
        {images.map((_, i) => {
          const opacity = position.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [0.5, 1, 0.5],
            extrapolate: "clamp",
          });

          const width = position.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [8, 18, 8],
            extrapolate: "clamp",
          });

          return (
            <Animated.View key={i} style={[styles.dots, { opacity, width }]} />
          );
        })}
      </Block>
    );
  };

  render() {
    return (
      <Block flex style={styles.gallery}>
        <Block flex middle style={{ position: "relative" }}>
          <Block style={styles.galleryImage}>{this.renderGallery()}</Block>

          <Block center style={styles.dotsContainer}>
            {this.renderProgress()}
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  gallery: {
    backgroundColor: theme.COLORS.BLACK,
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
  },
  galleryImage: {
    width: width,
    height: "auto",
  },
  dots: {
    height: 8,
    margin: 8,
    borderRadius: 4,
    backgroundColor: "white",
  },
  dotsContainer: {
    position: "absolute",
    bottom: theme.SIZES.BASE * 3,
    left: 0,
    right: 0,
  },
});
