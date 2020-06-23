const express = require("express");
const path = require("path");

const connectDB = require("./database/db");

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json({ extended: false }));

// database connection
connectDB();

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// serve static assets in production
if (process.env.NODE_ENV === "production") {
    // static folder
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

app.listen(port, () => console.log(`server started on port ${port}`));
