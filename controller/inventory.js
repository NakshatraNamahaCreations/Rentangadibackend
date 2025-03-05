const InventoryModel = require("../model/inventory");
const ProductManagementModel = require("../model/product");

class Inventory {
  async updateInventory(req, res) {
    const { startDate, endDate, products } = req.body;

    console.log("products", products);

    // Parse the start and end dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    try {
      // Iterate through each product
      for (const product of products) {
        const { ProductId, qty } = product;

        // Find the product in the product management model
        const pData = await ProductManagementModel.findById(ProductId);

        // Handle the case where the product does not exist
        if (!pData) {
          return res
            .status(404)
            .json({ error: `Product with ID ${ProductId} not found` });
        }

        // Iterate over the date range and create or update an entry for each day
        for (
          let dt = new Date(start);
          dt <= end;
          dt.setDate(dt.getDate() + 1)
        ) {
          const dateKey = new Date(dt);

          // Find an existing inventory entry for the product and date
          const existingEntry = await InventoryModel.findOne({
            productId: ProductId,
            startDate: dateKey,
          });

          if (existingEntry) {
            // Update the quantity and remaining quantity of the existing entry
            existingEntry.qty += qty;
            existingEntry.remainingQty += qty; // Assuming remainingQty should also increase
            await existingEntry.save();
          } else {
            // Calculate remaining quantity based on the product's total stock
            const remainingQty = pData.ProductStock - qty;

            // Create a new inventory entry
            const newOrder = new InventoryModel({
              productId: ProductId,
              startDate: dateKey,
              endDate: dateKey, // Optional, could be omitted or set to dateKey
              qty: qty,
              remainingQty: remainingQty >= 0 ? remainingQty : 0, // Ensure non-negative remaining quantity
            });

            await newOrder.save();
          }
        }
      }

      res.json({
        success: "Inventory updated successfully for each day in range",
      });
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(500).json({ error: "Failed to update inventory" });
    }
  }

  
  async getInventoryByDate  (req, res) {
    const { date } = req.query;
  
    try {
      const inventory = await InventoryModel.find({ date: new Date(date) });
  
      const products = await ProductManagementModel.find().lean();
  
      const stock = products.map((product) => {
        const inventoryEntry = inventory.find(
          (item) => item.productId.toString() === product._id.toString()
        );
  
        return {
          productId: product._id,
          productName: product.ProductName,
          totalStock: product.ProductStock,
          availableStock: inventoryEntry
            ? inventoryEntry.availableQty
            : product.ProductStock,
        };
      });
  
      res.status(200).json({ stock });
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory.", error: error.message });
    }
  };
  
   

  
  

  
  

  
  

  
}

const inventoryController = new Inventory();
module.exports = inventoryController;
