import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native'
import { theme, Block } from 'galio-framework'
import { useWallet } from '../navigation/WalletContext'
import { Images, walletTheme } from '../constants'
import Clipboard from '@react-native-community/clipboard'
import Icon from '../components/Icon'
import backendApi from '../api/backendGateway'
import LoadingScreen from '../components/LoadingScreen'
const { width, height } = Dimensions.get('screen')

const AccountDetails = () => {
  // Inicializa accountDetails con propiedades esperadas en null o valores por defecto
  const [accountDetails, setAccountDetails] = useState({
    beneficiaryName: '',
    beneficiaryAddress: '',
    accountNumber: '',
    accountType: '',
  })
  const { selectedAccount } = useWallet()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        if (!selectedAccount || !selectedAccount.accountId) {
          throw new Error('No hay una cuenta seleccionada válida.')
        }
        const { response: accountData, statusCode: accountStatusCode } =
          await backendApi.accountGateway.getById(selectedAccount.accountId)
        if (accountStatusCode === 200) {
          setAccountDetails(accountData)
        } else {
          throw new Error('Error al obtener los detalles de la cuenta.')
        }
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccounts()
  }, [selectedAccount])

  const copyToClipboard = (text) => {
    Clipboard.setString(text)
    alert('Copiado en el portapapeles')
  }

  const shareAccountDetails = () => {
    const message = `
      Detalles de la Cuenta para Transferencia: 
      - Nombre del Beneficiario: ${accountDetails.beneficiaryName}
      - Domicilio del Beneficiario: ${accountDetails.beneficiaryAddress}
      - Número de Cuenta: ${accountDetails.accountNumber}
      - Tipo de Cuenta: ${accountDetails.accountType}
    `
    Share.share({
      message,
    })
  }

  return (
    <Block flex style={styles.home}>
      <ImageBackground source={Images.Background} style={styles.background}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width }}
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* Transaction ID */}
          <View style={styles.detailCard}>
            <Text style={styles.cardTitle}>Nombre del beneficiario</Text>
            <View style={styles.fieldContainer}>
              <Text style={styles.field}>{accountDetails.beneficiaryName}</Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(accountDetails.beneficiaryName)}
              >
                <Icon name="clipboard" family="Feather" size={20} />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <Text style={styles.cardTitle}>Domicilio del beneficiario</Text>
            <View style={styles.fieldContainer}>
              <Text style={styles.field}>
                {accountDetails.beneficiaryAddress}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  copyToClipboard(accountDetails.beneficiaryAddress)
                }
              >
                <Icon name="clipboard" family="Feather" size={20} />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <Text style={styles.cardTitle}>Numero de cuenta</Text>
            <View style={styles.fieldContainer}>
              <Text style={styles.field}>{accountDetails.accountNumber}</Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(accountDetails.accountNumber)}
              >
                <Icon name="clipboard" family="Feather" size={20} />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <Text style={styles.cardTitle}>Tipo de cuenta</Text>
            <View style={styles.fieldContainer}>
              <Text style={styles.field}>{accountDetails.accountType}</Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(accountDetails.accountType)}
              >
                <Icon name="clipboard" family="Feather" size={20} />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.shareButton}
              onPress={shareAccountDetails}
            >
              <Text style={styles.shareButtonText}>Compartir Detalles</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
      <LoadingScreen visible={isLoading} />
    </Block>
  )
}

const styles = StyleSheet.create({
  home: {
    marginTop: 0,
  },
  background: {
    width: width,
    height: height * 1.1,
    marginTop: -100,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.SIZES.BASE,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.SIZES.BASE,
  },
  detailContainer: {
    width: '100%',
    backgroundColor: walletTheme.COLORS.WHITE,
    padding: theme.SIZES.BASE,
    marginTop: theme.SIZES.BASE / 2,
    borderRadius: theme.SIZES.BASE / 2,
    borderWidth: 1,
    borderColor: walletTheme.COLORS.BORDER,
  },
  detailLabel: {
    fontSize: 16,
  },
  shareButton: {
    marginTop: theme.SIZES.BASE,
    backgroundColor: walletTheme.COLORS.VIOLET,
    paddingVertical: 8,
    borderRadius: theme.SIZES.BASE / 2,
  },
  shareButtonText: {
    color: walletTheme.COLORS.WHITE,
    textAlign: 'center',
    fontSize: 16,
  },
  scrollViewContent: {
    paddingTop: 100,
  },
  detailCard: {
    backgroundColor: walletTheme.COLORS.WHITE,
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: theme.SIZES.BASE,
    borderRadius: theme.SIZES.BASE / 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    color: 'grey',
    marginBottom: theme.SIZES.BASE / 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  copyButton: {
    marginTop: 10,
    backgroundColor: walletTheme.COLORS.PRIMARY,
    padding: 10,
    borderRadius: 5,
  },
  copyButtonText: {
    color: '#FFF',
    textAlign: 'center',
  },
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  field: {
    fontSize: 14,
    color: walletTheme.COLORS.BLACK,
  },
  divider: {
    borderBottomColor: walletTheme.COLORS.BORDER,
    borderBottomWidth: 1,
    marginTop: 15,
    marginVertical: theme.SIZES.BASE / 2,
  },
})

export default AccountDetails
