const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const Match = require('../../models/match')



const uploadImage = async (req, res, next) => {
  try {
      if (req.file) {
          const imageUrl = req.file.location;
          const userId = req.user._id;
          // Update user data in the database with the image URL
          const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture: imageUrl }, { new: true });
          if (updatedUser) {
              res.status(200).json({ user: updatedUser });
          } else {
              res.status(404).json({ error: 'User not found' });
          }
      } else {
          res.status(400).json({ error: 'No image file uploaded' });
      }
  } catch (error) {
      console.error('Error updating user profile image:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

async function create(req, res) {
  try {
    // Add the user to the db
    const user = await User.create(req.body);
    const token = createJWT(user);
    res.json(token);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function login(req, res) {
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user) throw new Error();
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new Error();
    const token = createJWT(user);
    res.json(token);
  } catch (err) {
    res.status(400).json('Bad Credentials');
  }
}

function checkToken(req, res) {
  // req.user will always be there for you when a token is sent
  console.log('req.user', req.user);
  res.json(req.exp);
}

async function showAccounts(req, res) {
  try {
    const currentUser = req.user._id;
    // Find all matches where the current user's ID appears as the sender or receiver
    const matches = await Match.find({ users: currentUser });
    console.log('backend-matches', matches);
    // Get all user IDs involved in matches
    const matchedUserIds = matches.reduce((acc, match) => {
      console.log('match', match);
      match.users.forEach(user => {
        if (user._id.toString() !== currentUser.toString()) {
          acc.push(user._id.toString()); // Convert ObjectId to string
        }
      });
      return acc;
    }, []);
    // Fetch all users except the current user
    let users = await User.find({ _id: { $ne: currentUser,  $nin: matchedUserIds} });
    // Filter out matched users from the list of all users
    users = users.filter(user => !matchedUserIds.includes(user._id.toString())); // Convert ObjectId to string for comparison
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function showProfile(req, res) {
  try {
    const currentUser = req.user._id;
    let user = await User.find({ _id: currentUser });
    console.log('this is the mfn user:', user)
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}




/*--- Helper Functions --*/

function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}

module.exports = {
  create,
  login,
  checkToken,
  showAccounts,
  uploadImage,
  showProfile
};