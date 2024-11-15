import express from "express"
import { router as adminRouter } from "./admin"
import { router as siteRouter } from "./site"

const router = express.Router()

router.use("/", siteRouter)
router.use("/admin", adminRouter)

export default router