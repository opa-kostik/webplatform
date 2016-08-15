var express = require("express");
var router  = express.Router();
var User = require("../models/user");

//INDEX - show all
router.get("/", function(req, res){
    // Get all entries from DB
    User
        .find({})
        .where('role').in(['author', 'superuser'])
        .exec(function(err, foundAuthors){
        if(err){
            console.log(err);
        } else {
            res.render("/bio",{authors:foundAuthors});
        }
    });
});

module.exports = router;

