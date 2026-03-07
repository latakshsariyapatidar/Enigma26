import { Router } from "express";
import { checkQrLocation,checkPuzzleAnswer,getPuzzleHint,giveUpPuzzle } from "../controllers/qrCodeController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { checkEventActive } from "../middlewares/eventMiddleware.js";

const qrRouter = Router();

qrRouter.use(verifyJWT, checkEventActive);

qrRouter.get("/checkQrLocation/:locId",checkQrLocation);
qrRouter.get("/getPuzzleHint/:locId",getPuzzleHint);
qrRouter.post("/checkPuzzleAnswer/:locId",checkPuzzleAnswer);
qrRouter.post("/giveUpPuzzle/:locId",giveUpPuzzle);

export default qrRouter;