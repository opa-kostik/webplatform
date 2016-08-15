var express = require("express");
var router  = express.Router();
var Blogpost = require("../models/blogpost");
var middleware = require("../middleware");
//var request = require("request");

//INDEX - show all
router.get("/", function(req, res){
    // Get all entries from DB
    Blogpost.find({}, function(err, allPosts){
        if(err){
            console.log(err);
        } else {
            res.render("blogposts/index",{blogposts:allPosts});
        }
    });
});

//CREATE - add new entry to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to array
    var title   = req.body.title;
    var desc    = req.body.description;
    var date    = Date.now();
    var image   = req.body.image;
    var level   = 1;
    var author  = {
        id: req.user._id,
        username: req.user.username
    };
    var content = req.body.content.replace(/(\r\n|\n|\r)/gm,"");
    var newPost = {
        title: title,
        date: date,
        level: level,
        image: image,
        description: desc,
        author:author,
        content: content};
    // Create a new entry and save to DB
    Blogpost.create(newPost, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/blogposts");
        }
    });
});

//NEW - show form to create new entry
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("blogposts/new");
});

// SHOW - shows more info about one entry
router.get("/:id", function(req, res){
    //find the entry with provided ID
    Blogpost.findById(req.params.id).populate("comments").exec(function(err, foundEntry){
        if(err){
            console.log(err);
        } else {
            console.log(foundEntry);
            //render show template with that entry
            res.render("blogposts/show", {blogpost: foundEntry});
        }
    });
});

router.get("/:id/edit",
    function(req, res){
    //find the entry with provided ID
    Blogpost.findById(req.params.id, function(err, foundEntry){
        if(err){
            console.log(err);
        } else {
            //render show template with that entry
            res.render("blogposts/edit", {blogpost: foundEntry});
        }
    });
});

router.delete("/:blogpostId",function(req, res){
    Blogpost.findByIdAndRemove(req.params.blogpostId, function(err){
        if(err){
            console.log("PROBLEM during deleting of a post!");
        } else {
            res.redirect("/blogposts/");
        }
    })
});

router.put("/:id", function(req, res){

    var newContent = req.body.content.replace(/(\r\n|\n|\r)/gm,"");

    var newData = {
        title:       req.body.title,
        description: req.body.description,
        image:       req.body.image,
        content:     newContent
    };

    Blogpost.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, foundEntry){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/blogposts/" + foundEntry._id);
        }
    });
});

module.exports = router;

