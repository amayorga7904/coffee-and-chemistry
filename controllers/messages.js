const Match = require('../models/match')

const create = async () => {
    const senderId = req.user._id
    const match = await Match.findById(req.params.id)
    const content = req.body.content
    match.messages.push({
        content,
        sender: senderId
    })
    match.save()
    res.json(match._id)
}

module.exports = {
    create
}