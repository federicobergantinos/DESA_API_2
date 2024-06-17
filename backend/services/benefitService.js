// services/benefitService.js

const Benefit = require('../entities/benefits')

const createBenefitsForUser = async (userId, transaction) => {
  const benefits = [
    {
      key: 'starlink',
      title: 'Starlink',
      description: 'Obtener 2 GB/mes',
      reward: 2,
      claimed: false,
      userId,
    },
    {
      key: 'x',
      title: 'X',
      description: 'Obtener Basic',
      reward: 2.67,
      claimed: false,
      userId,
    },
    // Agrega más beneficios según sea necesario
  ]

  await Benefit.bulkCreate(benefits, { transaction })
}

const getAllBenefits = async () => {
  return await Benefit.findAll()
}

const getBenefitById = async (benefitId) => {
  return await Benefit.findByPk(benefitId)
}

const updateBenefit = async (benefitId, updates) => {
  const benefit = await Benefit.findByPk(benefitId)
  if (!benefit) {
    throw new Error('Benefit not found')
  }
  return benefit.update(updates)
}

const updateBenefitByKey = async (userId, key, updates) => {
  const benefit = await Benefit.findOne({ where: { userId, key } })
  if (!benefit) {
    throw new Error('Benefit not found')
  }
  return benefit.update(updates)
}

const deleteBenefitService = async (benefitId) => {
  const benefit = await Benefit.findByPk(benefitId)
  if (!benefit) {
    throw new Error('Benefit not found')
  }
  await benefit.destroy()
}

module.exports = {
  createBenefitsForUser,
  getAllBenefits,
  getBenefitById,
  updateBenefit,
  updateBenefitByKey,
  deleteBenefitService,
}
