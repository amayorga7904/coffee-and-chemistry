const Match = require('../models/match')

async function acceptMatch(req, res) {
        const { matchId } = req.params;
        try {
          // Update match status to "accepted"
          const acceptedMatch = await Match.findByIdAndUpdate(matchId, { status: 'accepted' }, { new: true });
          res.status(200).json({ message: 'Match Accepted successfully', match: acceptedMatch });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'An error occurred while accepting the match' });
        }
      }

async function rejectMatch(req, res) {
    const { matchId } = req.params;
    try {
      // Update match status to "rejected"
      const rejectedMatch = await Match.findByIdAndUpdate(matchId, { status: 'rejected' }, { new: true });
      res.status(200).json({ message: 'Match rejected successfully', match: rejectedMatch });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while rejecting the match' });
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
        res.json(matches);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching matches' });
    }
}

async function fetchMatches(req, res) {
    try {
        const userId = req.user._id;
        const matches = await Match.find({ users: { $elemMatch: { $eq: userId } } })
        .populate({
            path: 'messages',
            populate: { path: 'sender' }
        })
        .populate('users')
        console.log('fetch matches backend:', matches)
        res.json(matches);
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
            }],
            status: 'pending'
        })
        await match.save()
        res.json(match)
    } catch (error) {
        console.log(error)
    }
}

const deleteMatch = async (req, res) => {
  const matchId = req.params.id;
  try {
      const match = await Match.findById(matchId);
      if (!match) {
          return res.status(404).json({ message: 'Match not found' });
      }
      await match.remove();
      res.status(200).json({ message: 'Match deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
    createMatch,
    showMatch,
    fetchMatches,
    rejectMatch,
    acceptMatch,
    delete: deleteMatch,
}