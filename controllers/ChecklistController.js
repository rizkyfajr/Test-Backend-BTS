const db = require('../models')
const fs = require('fs')
const Checklist = db.checklist
const ChecklistItem = db.checklistItem

    exports.getAllChecklist = async (req, res) => {
    const userId = req.user.id

    const all = await Checklist.findAll({
      where: {
        user_id: userId
      }
    }).then((checklists) => {
      res.status(200).json({
        status: 200,
        message: 'All Checklist',
        data: checklists
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
    const userId = req.user.id
    const { name } = req.body
  
    if (! name) {
      return res.status(400).json({
        status: 400,
        message: 'Please insert a name for the checklist.',
      })
    }
  
    const checklist = await Checklist.create({
      name_checklist: name,
      user_id: userId
    }).then((checklist) => {
      res.status(201).json({
        status: 201,
        message: 'Checklist created',
        data: checklist
      })
    }).catch((err) => {
      res.status(500).json({
        status: 500,
        message: 'Ooppss... Server Error.',
        error: err
      })
    })
    }
  
    exports.deleteChecklist = async (req, res) => {
        try {
          const userId = req.user.id;
          const { checklistID } = req.params;
      
          if (!checklistID) {
            return res.status(400).json({
              status: 400,
              message: 'Please insert the checklist ID.',
            });
          }
      
          const checklist = await Checklist.findOne({ where: { id: checklistID, user_id: userId } }); // Cek ownership
      
          if (!checklist) {
            return res.status(404).json({
              status: 404,
              message: 'Checklist not found or you are not authorized.',
            });
          }
      
          const items = await ChecklistItem.findAll({ where: { id: checklistID } }); // Perbaikan nama kolom
      
          if (items.length > 0) {
            return res.status(403).json({
              status: 403,
              message: 'Checklist has items. Please delete the items first.',
            });
          }
      
          await Checklist.destroy({ where: { id: checklistID } });
      
          res.status(200).json({
            status: 200,
            message: 'Checklist deleted.',
          });
        } catch (err) {
          console.error("Error deleting checklist:", err);
          res.status(500).json({
            status: 500,
            message: 'Internal Server Error.',
            error: err.message,
          });
        }
      };
