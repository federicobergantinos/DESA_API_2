import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const Benefits = ({}) => {
  const [StarlinkOpen, setStarlinkOpen] = useState(false)
  const [XOpen, setXOpen] = useState(false)
  const [TeslaOpen, setTeslaOpen] = useState(false)
  const [SpaceXOpen, setSpaceXOpen] = useState(false)

  return (
    <ImageBackground
      source={require('../../assets/images/fondopantalla.png')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => console.log('Boton')}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.header}>Beneficios</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>XCoin totales:</Text>
          <Text style={styles.balanceAmount}>0.00 XCoin</Text>
        </View>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Beneficios</Text>
        </View>
        <Text style={styles.subtitle}>
          ¡Utiliza tu XCoin para obtener beneficios increíbles!
        </Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setStarlinkOpen(!StarlinkOpen)}
        >
          <Text style={styles.dropdownText}>Starlink</Text>
          <Icon
            name={StarlinkOpen ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        {StarlinkOpen && (
          <View style={styles.dropdownContent}>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>2 XCoin → 2 GB/mes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>4 XCoin → 4 GB/mes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>6 XCoin → 6 GB/mes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>8 XCoin → 8 GB/mes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>10 XCoin → 10 GB/mes</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setXOpen(!XOpen)}
        >
          <Text style={styles.dropdownText}>X</Text>
          <Icon
            name={XOpen ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        {XOpen && (
          <View style={styles.dropdownContent}>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>2.67 XCoin → Basic</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>7 XCoin → Premium</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>14 XCoin → Premium +</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setTeslaOpen(!TeslaOpen)}
        >
          <Text style={styles.dropdownText}>Tesla</Text>
          <Icon
            name={TeslaOpen ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        {TeslaOpen && (
          <View style={styles.dropdownContent}>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>Opción 1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>Opción 2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>Opción 3</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setSpaceXOpen(!SpaceXOpen)}
        >
          <Text style={styles.dropdownText}>SpaceX</Text>
          <Icon
            name={SpaceXOpen ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        {SpaceXOpen && (
          <View style={styles.dropdownContent}>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>Opción 1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>Opción 2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>Opción 3</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  header: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  balanceContainer: {
    backgroundColor: '#5144A6',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  balanceText: {
    color: '#F2F2F2',
    fontSize: 18,
  },
  balanceAmount: {
    color: '#F2F2F2',
    fontSize: 22,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#5D4EBF',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#F2F2F2',
    fontSize: 18,
  },
  subtitle: {
    color: '#F2F2F2',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  dropdownButton: {
    backgroundColor: '#5D4EBF',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  dropdownText: {
    color: '#F2F2F2',
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
  },
  dropdownContent: {
    backgroundColor: '#9B91D9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#B3ADD9',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  optionText: {
    color: '#F2F2F2',
    fontSize: 16,
    textAlign: 'center',
  },
})

export default Benefits