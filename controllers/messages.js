const Match = require('../models/match')

const create = async () => {
    const senderId = req.user._id
    const match = await Match.findById(req.params.id)
}

module.exports = {
    create
}