const Vote = require('../models/Vote');

exports.vote = async (req, res, next) => {
  try {
    const { answer_id, vote_type } = req.body;

    if (!['upvote', 'downvote'].includes(vote_type)) {
      return res.status(400).json({ message: 'vote_type must be upvote or downvote.' });
    }

    const result = await Vote.upsert({
      answer_id,
      user_id: req.user.id,
      vote_type,
    });

    const counts = await Vote.getCounts(answer_id);
    const userVote = await Vote.getUserVote(answer_id, req.user.id);

    res.json({ ...result, ...counts, userVote });
  } catch (err) {
    next(err);
  }
};
