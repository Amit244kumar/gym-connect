import gymOwnerAuth from './gymOwnerAuth.js';
import express from "express"
const router=express.Router()

router.use("/gymOnwerAuth",gymOwnerAuth)

export default router;