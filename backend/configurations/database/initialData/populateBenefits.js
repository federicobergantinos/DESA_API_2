// services/benefitService.js

const Benefit = require('../../../entities/benefits')

const populateBenefits = async () => {
  const benefits = [
    {
      key: 'starlink_2gb',
      title: 'Starlink',
      description: 'Obtener 2 GB/mes',
      price: 2,
    },
    {
      key: 'starlink_4gb',
      title: 'Starlink',
      description: 'Obtener 4 GB/mes',
      price: 4,
    },
    {
      key: 'starlink_6gb',
      title: 'Starlink',
      description: 'Obtener 6 GB/mes',
      price: 6,
    },
    {
      key: 'x_basic',
      title: 'X',
      description: 'Obtener Basic',
      price: 2.67,
    },
    {
      key: 'x_premium',
      title: 'X',
      description: 'Obtener Premium',
      price: 7,
    },
    {
      key: 'x_premium_plus',
      title: 'X',
      description: 'Obtener Premium +',
      price: 14,
    },
    {
      key: 'tesla_option1',
      title: 'Tesla',
      description: 'Opción 1',
      price: 10,
    },
    {
      key: 'tesla_option2',
      title: 'Tesla',
      description: 'Opción 2',
      price: 20,
    },
    {
      key: 'tesla_option3',
      title: 'Tesla',
      description: 'Opción 3',
      price: 30,
    },
    {
      key: 'spacex_patch',
      title: 'SpaceX',
      description: 'STARSHIP FLIGHT 4 MISSION PATCH',
      price: 5,
    },
    {
      key: 'spacex_tshirt',
      title: 'SpaceX',
      description: 'UNISEX STARSHIP FLIGHT 4 T-SHIRT',
      price: 15,
    },
  ]

  await Benefit.bulkCreate(benefits)
}

module.exports = populateBenefits
