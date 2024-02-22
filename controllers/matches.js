const Match = require('../models/match')

module.exports = {
    createMatch
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