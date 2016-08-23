var express = require("express");
var router  = express.Router();
var Service = require("../models/service");
var middleware = require("../middleware");
//var request = require("request");

//INDEX - show all
router.get("/", function(req, res){
    // Get all entries from DB
    Service.find({}, function(err, foundEntries){
        if(err){
            console.log(err);
        } else {
            res.render("services/index",{services:foundEntries});
        }
    });
});

//CREATE - add new entry to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to array
    var title   = req.body.title;
    var image   = req.body.image;
    var desc    = req.body.description;
    var content = req.body.content.replace(/(\r\n|\n|\r)/gm,"");
    var newService = {title: title, image: image, description: desc, content: content};
    // Create a new entry and save to DB
    Service.create(newService, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/services");
        }
    });
});

//NEW - show form to create new entry
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("services/new");
});

// SHOW - shows more info about one entry
router.get("/:id", function(req, res){
    //find the entry with provided ID
    Service.findById(req.params.id).exec(function(err, foundEntry){
        if(err){
            console.log(err);
        } else {
            console.log(foundEntry);
            //render show template with that entry
            res.render("services/show", {service: foundEntry});
        }
    });
});

router.get("/:id/edit", function(req, res){
    //find the entry with provided ID
    Service.findById(req.params.id, function(err, foundEntry){
        if(err){
            console.log(err);
        } else {
            //render show template with that entry
            res.render("services/edit", {service: foundEntry});
        }
    });
});

router.put("/:id", function(req, res){
    var newContent = req.body.content.replace(/(\r\n|\n|\r)/gm,"");
    var newData = {
        title: req.body.title,
        image: req.body.image,
        description: req.body.description,
        content: newContent
    };
    Service.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, foundEntry){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/services/" + foundEntry._id);
        }
    });
});

module.exports = router;

