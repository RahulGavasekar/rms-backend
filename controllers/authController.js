const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

//register
const registerController = async (req, res) => {
  try {
    const { username, email, password, phone, address } = req.body;

    //validation for all fields filled
    if (!username || !email || !password || !phone || !address) {
      return res.status(500).send({
        success: false,
        message: "Please fill all fields",
      });
    }

    //validation for existing user
    const existingAccount = await userModel.findOne({ email });
    if (existingAccount) {
      return res.status(400).send({
        success: false,
        message: "Email already register please login",
      });
    }

    //hashing password
    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
    });
    res.status(200).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).send({
      success: false,
      message: "Error in register api",
      err,
    });
  }
};

// LOGIN
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please provide EMail OR Password",
      });
    }

    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    //check user passsword or compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid Credentials",
      }); //if password is incorrect return error message  else continue with login process
    }

    //token
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", //token expires in 7 days
    });
    //we will undefine the password
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error In Login API",
      err,
    });
  }
};

module.exports = { registerController, loginController };
