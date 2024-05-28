require('dotenv').config({ path: require('find-config')('.env') })
const { Op } = require('sequelize')

const db = require('../models')
const ChecklistItem = db.checklistItem

exports.getAllChecklistItem = async (req, res) => {
  const { checklistID } = req.params

  const all = await ChecklistItem.findAll({
    where: {
      checklist_id: checklistID
    }
  }).then((checklistItems) => {
    res.status(200).json({
      status: 200,
      message: 'All Checklist Items',
      data: checklistItems
    })
  }).catch((err) => {
    res.status(500).json({
      status: 500,
      message: 'Ooppss... Server Error.',
      error: err
    })
  })
}

exports.store = async (req, res) => {
  const { itemName } = req.body
  const { checklistID } = req.params

  if (! itemName) {
    return res.status(400).json({
      status: 400,
      message: 'Please insert a name for the checklist item.',
    })
  }

  const checklistItem = await ChecklistItem.create({
    item_name: itemName,
    checklist_id: checklistID
  }).then((checklistItem) => {
    res.status(201).json({
      status: 201,
      message: 'Checklist Item created.',
      data: checklistItem
    })
  }).catch((err) => {
    res.status(500).json({
      status: 500,
      message: 'Ooppss... Server Error.',
      error: err
    })
  })
}

exports.getOne = async (req, res) => {
  const { checklistItemId } = req.params

  const one = await ChecklistItem.findOne({
    where: {
      id: checklistItemId
    }
  }).then((checklistItem) => {
    res.status(200).json({
      status: 200,
      message: 'Checklist Item.',
      data: checklistItem
    })
  }).catch((err) => {
    res.status(500).json({
      status: 500,
      message: 'Ooppss... Server Error.',
      error: err
    })
  })
}

exports.setDone = async (req, res) => {
  const { checklistID, checklistItemID } = req.params

  const checklistItem = await ChecklistItem.update({
    status: true
  }, {
    where: {
      id: checklistItemID,
      checklist_id: checklistID
    }
  }).then((checklistItem) => {
    res.status(200).json({
      status: 200,
      message: 'Checklist Item marked as done.',
      data: checklistItem
    })
  }).catch((err) => {
    res.status(500).json({
      status: 500,
      message: 'Ooppss... Server Error.',
      error: err
    })
  })
}

exports.deleteChecklistItem = async (req, res) => {
  const { checklistID, checklistItemID } = req.params
  
  const find = await ChecklistItem.findOne({
    where: {
      id: checklistItemID,
      checklist_id: checklistID
    }
  })

  if (!find) {
    return res.status(404).json({
      status: 404,
      message: 'Checklist Item not found.',
    })
  }

  const checklistItem = await find.destroy({
    where: {
      id: checklistItemID,
      checklist_id: checklistID
    }
  }).then((checklistItem) => {
    res.status(200).json({
      status: 200,
      message: 'Checklist Item deleted.',
      data: checklistItem
    })
  }).catch((err) => {
    res.status(500).json({
      status: 500,
      message: 'Ooppss... Server Error.',
      error: err
    })
  })
}

exports.renameChecklistItem = async (req, res) => {
  const { checklistID, checklistItemID } = req.params
  const { item_name } = req.body

  if (! item_name) {
    return res.status(400).json({
      status: 400,
      message: 'Please insert a name for the checklist item.',
    })
  }

  const find = await ChecklistItem.findOne({
    where: {
      id: checklistItemID,
      checklist_id: checklistID
    }
  })

  const checklistItem = await find.update({
    item_name: item_name
  }, {
    where: {
      id: checklistItemID,
      checklist_id: checklistID
    }
  }).then((checklistItem) => {
    res.status(200).json({
      status: 200,
      message: 'Checklist Item renamed.',
      data: find
    })
  }).catch((err) => {
    res.status(500).json({
      status: 500,
      message: 'Ooppss... Server Error.',
      error: err
    })
  })
}