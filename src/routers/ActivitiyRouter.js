const express = require("express");
const activityRoute = express.Router();

const {
    UploadExel,
    postData,
    GetActivity
}= require('../controllers/ActivityController');


activityRoute.get('/list/:id_ticket',GetActivity)
activityRoute.post("/upload/post/:activityId", postData)
activityRoute.post("/upload", UploadExel);
activityRoute.get("/test", (req, res) => {
    res.send("This is work :)");
});

module.exports = activityRoute;