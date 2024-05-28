const express = require('express')

const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router()

const Checklist = require('../controllers/ChecklistController')
const auth = require('../controllers/AuthController')
const ChecklistItem = require('../controllers/ChecklistItemController')


// Auth
router.post('/register', auth.register)
router.post('/login', auth.login)

//checklist
router.get('/checklist', authMiddleware, Checklist.getAllChecklist)
router.delete('/checklist/:checklistID', authMiddleware, Checklist.deleteChecklist)
router.post('/checklist', authMiddleware, Checklist.store)

//checklist items
router.get('/checklist/:checklistID/item', authMiddleware, ChecklistItem.getAllChecklistItem)
router.post('/checklist/:checklistID/item', authMiddleware, ChecklistItem.store)
router.get('/checklist/:checklistID/item/:checklistItemID', authMiddleware, ChecklistItem.getOne)
router.put('/checklist/:checklistID/item/rename/:checklistItemID', authMiddleware, ChecklistItem.renameChecklistItem)
router.put('/checklist/:checklistID/item/status/:checklistItemID', authMiddleware, ChecklistItem.setDone)
router.delete('/checklist/:checklistID/item/delete/:checklistItemID', authMiddleware, ChecklistItem.deleteChecklistItem)


module.exports = router;