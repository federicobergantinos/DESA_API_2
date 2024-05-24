import React, { useState } from 'react'
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { theme, Block } from 'galio-framework'
import { Images, walletTheme } from '../constants'
import Icon from 'react-native-vector-icons/FontAwesome'

const { width, height } = Dimensions.get('screen')

const FAQ = () => {
  const [expanded, setExpanded] = useState(null)

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index)
  }

  const Card = ({ title, children }) => (
    <View style={styles.detailCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  )

  const FAQItem = ({ question, answer, index }) => (
    <>
      <TouchableOpacity
        onPress={() => toggleExpand(index)}
        style={styles.faqItem}
      >
        <Text style={styles.faqQuestion}>{question}</Text>
        <Icon
          name={expanded === index ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={walletTheme.COLORS.VIOLET}
        />
      </TouchableOpacity>
      {expanded === index && (
        <View style={styles.answerContainer}>
          <Text style={styles.faqAnswer}>{answer}</Text>
        </View>
      )}
    </>
  )

  return (
    <Block flex style={styles.home}>
      <ImageBackground source={Images.Background} style={styles.background}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width }}
          contentContainerStyle={styles.scrollViewContent}
        >
          <Card title="Preguntas Frecuentes">
            <FAQItem
              question="¿Cómo puedo depositar USD, ARS o XCN en mi wallet?"
              answer="Para depositar fondos en tu wallet:
              1. Abre tu aplicación de wallet y selecciona la moneda que deseas depositar (USD, ARS o XCN).
              2. Toca la opción 'Recibir' o 'Depósito'.
              3. Copia la dirección de tu wallet o escanea el código QR proporcionado.
              4. Envía los fondos a esta dirección desde otra wallet o exchange.
              5. Espera a que la transacción sea confirmada en la red."
              index={1}
            />
            <FAQItem
              question="¿Es seguro almacenar XCN en mi wallet?"
              answer="Sí, almacenar XCN en tu wallet es seguro siempre y cuando tomes las siguientes precauciones:
              1. Mantén tu frase de recuperación en un lugar seguro y nunca la compartas con nadie.
              2. Utiliza la autenticación de dos factores (2FA) si tu wallet lo permite.
              3. No compartas tu clave privada.
              4. Mantén tu dispositivo móvil protegido con contraseñas o biometría.
              5. Descarga solo aplicaciones de wallet de fuentes oficiales."
              index={2}
            />
            <FAQItem
              question="¿Cómo puedo intercambiar USD, ARS y XCN en mi wallet?"
              answer="Para intercambiar monedas dentro de tu wallet:
              1. Abre tu aplicación de wallet y selecciona la opción 'Intercambiar' o 'Swap'.
              2. Elige la moneda que deseas intercambiar (por ejemplo, USD) y la moneda de destino (por ejemplo, XCN).
              3. Ingresa la cantidad que deseas intercambiar y confirma la transacción.
              4. Revisa las tasas de intercambio y las tarifas antes de confirmar.
              5. La transacción se procesará y las monedas intercambiadas aparecerán en tu wallet."
              index={3}
            />
            <FAQItem
              question="¿Cómo puedo usar XCN para comprar productos o servicios relacionados con X?"
              answer="Para usar XCN para comprar productos o servicios relacionados con X:
              1. Asegúrate de que el comerciante o plataforma acepte XCN como método de pago.
              2. Selecciona el producto o servicio que deseas comprar.
              3. Al momento del pago, selecciona XCN como método de pago.
              4. Escanea el código QR del comerciante o ingresa la dirección de la wallet del comerciante.
              5. Envía la cantidad exacta de XCN indicada.
              6. Espera la confirmación de la transacción por parte del comerciante."
              index={4}
            />
            <FAQItem
              question="¿Qué debo hacer si pierdo acceso a mi wallet?"
              answer="Si pierdes acceso a tu wallet, puedes recuperarla usando tu frase de recuperación:
              1. Descarga e instala nuevamente la aplicación de wallet en tu dispositivo.
              2. Abre la aplicación y selecciona 'Recuperar wallet'.
              3. Ingresa tu frase de recuperación en el orden correcto.
              4. Sigue las instrucciones para restablecer el acceso a tu wallet.
              5. Una vez recuperada, asegúrate de proteger tu wallet con contraseñas fuertes y habilitar la autenticación de dos factores si es posible."
              index={5}
            />
          </Card>
        </ScrollView>
      </ImageBackground>
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
  detailCard: {
    backgroundColor: theme.COLORS.WHITE,
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
    marginBottom: theme.SIZES.BASE / 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: theme.COLORS.BLACK,
    textAlign: 'justify',
  },
  scrollViewContent: {
    paddingTop: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.PRIMARY,
  },
  backButton: {
    marginRight: theme.SIZES.BASE,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.WHITE,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.SIZES.BASE,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.MUTED,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    width: width * 0.75,
  },
  answerContainer: {
    paddingVertical: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE,
  },
  faqAnswer: {
    fontSize: 14,
    color: theme.COLORS.BLACK,
    textAlign: 'justify',
  },
})

export default FAQ
