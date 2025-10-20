import gymOwnerAuth from './gymOwnerAuth.js';
import memberAuth from '../routes/membersAuth.js';
import express from "express"
const router=express.Router()

router.use("/gymOnwerAuth",gymOwnerAuth)
router.use('/memberAuth',memberAuth)

export default router;