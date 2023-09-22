const welcome = async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "Welcome to SilexSecure CMS APIs.", status: "Success" });
  } catch (error) {
    res.status(500).json({ message: "Error... Internal server error", error });
  }
};

module.exports = welcome;
