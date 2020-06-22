const mongoose = require("mongoose");

const checkId = (idName) => (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[idName]))
        return res.status(400).json({ msg: "Invalid ID" });

    next();
};

module.exports = checkId;
