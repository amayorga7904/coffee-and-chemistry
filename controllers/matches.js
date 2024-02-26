const Match = require('../models/match')


const unmatch = async (req, res) => {
    const matchId = req.params.matchId
    try {
        const match = Match.findById(matchId)
        await match.remove()
        res.status(200).json({ message: 'Code deleted successfully' })
    } catch (error) {
        console.log(error)
    }
}

async function showMatch(req, res) {
    try {
        const userId = req.user._id;
        const matches = await Match.find({ users: { $elemMatch: { $eq: userId } } })
        .populate({
            path: 'messages',
            populate: { path: 'sender' }
        })
        .populate('users')
        console.log('backend-matches', matches);
        res.json(matches);
        console.log('backend-user', userId);
        console.log('will this show?');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching matches' });
    }
}



async function createMatch(req, res) {
    userId = req.user._id
    receiverId = req.body.receiver
    const { content } = req.body
    try {
        const match = new Match({
            users: [userId, receiverId],
            messages: [{
                content: content,
                sender: userId
            }]
        })
        await match.save()
        res.json(match)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    createMatch,
    showMatch,
    delete: unmatch
}