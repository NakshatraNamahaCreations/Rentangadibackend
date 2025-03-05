const mongoose = require("mongoose");
const Enquirymodel = require("../model/enquiry");
const Counter = require("../model/getNextSequence");
const Inventory = require("../model/inventory");

class Enquiry {
  async createEnquiry(req, res) {
    const {
      clientId,
      enquiryDate,
      enquiryTime,
      endDate,
      clientName,
      executivename,
      clientNo,
      address,
      products,
      category,
      status,
      GrandTotal,
      adjustments,
      discount,
      termsandCondition,
      GST,
      placeaddress,
    } = req.body;

 console.log(placeaddress)





    try {
      const latestCustomer = await Enquirymodel.findOne()
        .sort({ enquiryId: -1 })
        .exec();
      const latestEquiry = latestCustomer ? latestCustomer.enquiryId : 0;
      const newEquiry = latestEquiry + 1;
      const enquiryId = await Counter?.getNextSequence("enquiryId");
      // Create a new Enquiry with the incremented enquiryId
      const newEnquiry = new Enquirymodel({
        clientId,
        enquiryId,
        clientName,
        executivename,
        endDate,
        products,
        clientNo,
        address,
        category,
        enquiryDate,
        enquiryTime,
        termsandCondition,
        GrandTotal,
        adjustments,
        discount,
        GST,
        status,
        placeaddress
      });

      // Save the new Enquiry to the database
      const savedEnquiry = await newEnquiry.save();

      if (savedEnquiry) {
        return res.json({ success: "Enquiry created successfully" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create Enquiry" });
    }
  }

  async updateEnquiries(req, res) {
    let { id } = req.params;
    let { GrandTotal, adjustments, discount, GST,hasBeenUpdated } = req.body;
    console.log(GrandTotal,adjustments,discount,GST)
    try {
      const enquiry = await Enquirymodel.findByIdAndUpdate({ _id:id });
      if (GrandTotal !== undefined) enquiry.GrandTotal = GrandTotal;
      if (adjustments !== undefined) enquiry.adjustments = adjustments;
      if (discount !== undefined) enquiry.discount = discount;
      if (GST !== undefined) enquiry.GST = GST;
      if(hasBeenUpdated !== undefined) enquiry.hasBeenUpdated = true;

      const updatedEnquiry = await enquiry.save(); 
      console.log(updatedEnquiry,"wrwwy9")
      return res
        .status(200)
        .json({ success: "Enquiry updated successfully", updatedEnquiry });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update Enquiry" });
    }
  }

  async getTotalAndTodayEnquiryCount(req, res) {
    try {
      // Get the current date and set the time to the start of the day
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Get the current date and set the time to the end of the day
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Count the total number of documents
      let totalEnquiryCount = await Enquirymodel.countDocuments({});

      // Count the number of documents created today
      let todayEnquiryCount = await Enquirymodel.countDocuments({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      return res.json({
        totalEnquiryCount: totalEnquiryCount,
        todayEnquiryCount: todayEnquiryCount,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve Enquiry counts" });
    }
  }

  async updateenquiryfollowup(req, res) {
    let { followupStatus } = req.body;
    let enquiryId = req.params.id;

    try {
      const enquiryData = await Enquirymodel.findOneAndUpdate(
        { _id: enquiryId },
        { followupStatus: followupStatus }
      );

      if (enquiryData) {
        return res.status(200).json({ success: "updated succesfully" });
      }
    } catch (error) {
      console.error("Something went wrong", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getEnquiryaggredata(req, res) {
    const id = req.params.id;

    try {
      const Data = await Enquirymodel.find({ _id: id });

      if (Data.length > 0) {
        return res.json({ EnquiryData: Data });
      } else {
        return res.status(404).json({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to retrieve data" });
    }
  }

  async allEnquiry(req, res) {
    try {
      const enquiryData = await Enquirymodel.find({}).sort({ _id: -1 });

      if (enquiryData) {
        return res.status(200).json({ enquiryData: enquiryData });
      }
    } catch (error) {
      console.error("Something went wrong", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async postdeleteEnquiry(req, res) {
    let id = req.params.id;
    try {
      const data = await Enquirymodel.deleteOne({ _id: id });
      if (data.deletedCount > 0) {
        return res.json({ success: "Successfully deleted" });
      } else {
        return res.status(404).json({ error: "Enquiry not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete Enquiry" });
    }
  }

  async updateEnquiry(req, res) {
    try {
      const id = req.params.id; // Extract enquiry ID from the URL
      const updateData = req.body; // Extract fields to update from the request body

      // Log received data for debugging
      console.log("Enquiry ID:", id);
      console.log("Update Data:", updateData);

      // Validate required fields
      if (!id) {
        return res.status(400).json({ error: "Enquiry ID is required" });
      }

      // Perform the update operation
      const updatedEnquiry = await Enquirymodel.findOneAndUpdate(
        { _id: id }, // Query condition: Match by ID
        updateData, // Update operation: Use the received fields to update
        { new: true } // Return the updated document
      );

      if (updatedEnquiry) {
        return res.status(200).json({
          success: true,
          message: "Enquiry updated successfully",
          enquiry: updatedEnquiry,
        });
      } else {
        return res.status(404).json({ error: "Enquiry not found" });
      }
    } catch (error) {
      console.error("Error in updateEnquiry:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async addProductsToEnquiry(req, res) {
    const { id, products, adjustment = 0 } = req.body;
    console.log(req.body, "Request Body");

    try {
      // Find the enquiry by clientId
      const enquiry = await Enquirymodel.findOne({ enquiryId: id });

      if (!enquiry) {
        return res.status(404).json({ error: "Enquiry not found" });
      }

      // Validate products array
      if (!Array.isArray(products) || products.length === 0) {
        return res
          .status(400)
          .json({ error: "Products must be a non-empty array" });
      }

      // Append new products to the existing products array
      enquiry.products = [...(enquiry.products || []), ...products];

      // Calculate the new grand total
      const productTotal = enquiry.products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );
      const updatedGrandTotal = Math.max(0, productTotal - adjustment);

      // Update enquiry fields
      enquiry.grandTotal = updatedGrandTotal;
      enquiry.adjustment = adjustment;

      // Save the updated enquiry
      const updatedEnquiry = await enquiry.save();
      console.log(updatedEnquiry, "Updated Enquiry");

      return res.status(200).json({
        success: "Products added successfully",
        data: updatedEnquiry,
      });
    } catch (error) {
      console.error("Error adding products to enquiry:", error.message);
      return res
        .status(500)
        .json({ error: "Failed to add products to Enquiry" });
    }
  }
}

const EnquiryController = new Enquiry();
module.exports = EnquiryController;
