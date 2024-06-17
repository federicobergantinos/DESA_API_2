// controllers/benefitController.js

const {
  populateBenefits,
  getAllBenefits,
  getBenefitById,
  updateBenefit,
  deleteBenefitService,
} = require('../services/benefitService')
const { sendResponse } = require('../configurations/utils.js')

const populate = async (req, res) => {
  try {
    await populateBenefits()
    return sendResponse(res, 201, { msg: 'Benefits populated successfully' })
  } catch (error) {
    console.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const getAll = async (req, res) => {
  try {
    const benefits = await getAllBenefits()
    return sendResponse(res, 200, benefits)
  } catch (error) {
    console.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const getById = async (req, res) => {
  try {
    const benefit = await getBenefitById(req.params.benefitId)
    return sendResponse(res, 200, benefit)
  } catch (error) {
    console.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const update = async (req, res) => {
  try {
    const updatedBenefit = await updateBenefit(req.params.benefitId, req.body)
    return sendResponse(res, 200, updatedBenefit)
  } catch (error) {
    console.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

const deleteBenefit = async (req, res) => {
  try {
    await deleteBenefitService(req.params.benefitId)
    return res.status(204).send()
  } catch (error) {
    console.error(` ${error}`)
    return sendResponse(res, error.code || 500, {
      msg: error.message || 'An exception has occurred',
    })
  }
}

module.exports = {
  populate,
  getAll,
  getById,
  update,
  deleteBenefit,
}
