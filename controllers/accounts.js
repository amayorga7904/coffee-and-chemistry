const Account = require('../models/account')
const User = require('../models/user')
const Match = require('../models/match')

module.exports = {
    create,
    showAccounts
}

async function showAccounts(req, res) {
    try {
        // Make sure the user is authenticated before accessing req.user._id
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const match = await Match.findOne();
        const userId = req.user._id;
        let users = await User.find({ _id: { $ne: userId } });
        res.json({ users, match });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


async function create(req, res) {
    req.body.user = req.user._id
    const user = await User.findById(req._user)
    user.name = req.body.name
    user.born = req.body.born
    user.bio = req.body.bio
    await Account.create(req.body)
    await user.save()
    res.json(user)
    console.log('account created')
}