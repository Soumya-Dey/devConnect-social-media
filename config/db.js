require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log("db connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;
