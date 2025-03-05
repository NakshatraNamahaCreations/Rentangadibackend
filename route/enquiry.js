const express = require("express");
const router = express.Router();
const EnquiryController = require("../controller/enquiry");

router.post("/createEnquiry", EnquiryController.createEnquiry);
router.get(
  "/TotalNumberOfEnquiry",
  EnquiryController.getTotalAndTodayEnquiryCount
);
router.get("/getallEnquiry", EnquiryController.allEnquiry);
router.post("/updatefollowup/:id", EnquiryController.updateenquiryfollowup);
router.put("/updatestatus/:id", EnquiryController.updateEnquiry);
router.post("/deleteEnquiry/:id", EnquiryController.postdeleteEnquiry);
router.get("/getEnquiryaggbyid/:id", EnquiryController.getEnquiryaggredata);
router.post("/add-products", EnquiryController.addProductsToEnquiry);
router.put('/updateenquiries/:id', EnquiryController.updateEnquiries);
module.exports = router;
