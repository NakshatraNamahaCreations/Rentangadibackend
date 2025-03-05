const express = require("express");
const router = express.Router();
const refurbishmentController = require("../controller/refurbishment");

router.post(
  "/addRefurbishment",

  refurbishmentController.CreateRefurbishment
);
router.get("/getRefurbishment", refurbishmentController.getRefurbishment);

router.post(
  "/deleteRefurbishment/:id",
  refurbishmentController.postdeleteRefurbishment
);
router.put(
  "/editRefurbishment/:id",

  refurbishmentController.postdeleteRefurbishment
);

module.exports = router;
