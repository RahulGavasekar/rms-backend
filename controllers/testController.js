const testuserController = (req, res) => {
  try {
    res.status(200).send("<h2> Testing user data  </h2>");
  } catch (error) {
    console.log("err", error);
  }
};

module.exports = { testuserController };
