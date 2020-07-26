const admin = require("firebase-admin");

const serviceAccount = require("./fireKey");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "devconnect-social.appspot.com",
    databaseURL: "https://devconnect-social.firebaseio.com",
});

const bucketref = admin.storage().bucket();

module.exports = bucketref;
