// services/benefitService.js

const Benefit = require('../entities/benefits')

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
  getAllBenefits,
  getBenefitById,
  updateBenefit,
  updateBenefitByKey,
  deleteBenefitService,
}
