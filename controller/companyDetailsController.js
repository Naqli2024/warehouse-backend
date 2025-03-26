const CreateAccount = require("../models/authModel/createAccountModel");

const addCompanyDetails = async (req, res) => {
    try {
      const { userId } = req.params;
      const companyDetails = req.body;
  
      const user = await CreateAccount.findById(userId);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }
  
      user.companyDetails = companyDetails;  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Company details added successfully",
        data: user
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  module.exports = { addCompanyDetails };