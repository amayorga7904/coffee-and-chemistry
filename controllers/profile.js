const User = require('../models/user');



async function editBio(req, res) {
    try {
      const userId = req.params.userId;
      console.log(userId)
      const newBio = req.body.bio
      const user = await User.findById(userId);
      user.bio = newBio
      console.log('this is the mfn user:', user)
      console.log('new bio in backend:', user.bio)
      console.log('or is it this?:', newBio)
      await user.save()
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }


  module.exports = {
    editBio
  };