var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {
    title: "ExpressTest2019",
    tester: "some test string" // why no work?
  });
});

module.exports = router;
