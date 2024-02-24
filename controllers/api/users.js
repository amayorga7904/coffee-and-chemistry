const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const Match = require('../../models/match')

module.exports = {
  create,
  login,
  checkToken,
  showAccounts
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
    const matches = await Match.find({
      $or: [{ sender: currentUser }, { receiver: currentUser }]
    });

    console.log('backend-matches', matches);

    // Get all user IDs involved in matches
    const matchedUserIds = matches.reduce((acc, match) => {
      console.log('match', match);
      if (match.sender && match.sender.toString() === currentUser.toString()) {
        acc.push(match.receiver.toString()); // Convert ObjectId to string
      } else if (match.receiver && match.receiver.toString() === currentUser.toString()) {
        acc.push(match.sender.toString()); // Convert ObjectId to string
      } else {
        console.log('Match sender and receiver are both undefined:', match);
      }
      return acc;
    }, []);

    // Fetch all users except the current user
    let users = await User.find({ _id: { $ne: currentUser } });

    // Filter out matched users from the list of all users
    users = users.filter(user => !matchedUserIds.includes(user._id.toString())); // Convert ObjectId to string for comparison

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


// async function showAccounts(req, res) {
//   try {
//     const currentUser = req.user._id;
    
//     // Find all matches where the current user's ID appears as the sender or receiver
//     const matchedUsers = await Match.find({
//       $or: [{ sender: currentUser }, { receiver: currentUser }]
//     })
//     console.log('backend matched users:', matchedUsers);
    
//     // Fetch all users except the current user
//     let allUsers = await User.find({ _id: { $ne: currentUser } });
//     console.log('All users:', allUsers);
    
//     // Filter out the matched users from the list of all users
//     let users = allUsers.filter(user => !matchedUsers.includes(user._id.toString()));
//     console.log('Filtered users:', users);
    
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }




/*--- Helper Functions --*/

function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}