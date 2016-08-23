var express     = require("express");
var router      = express.Router();
var Blogpost    = require("../models/blogpost");
// var Tag         = require("../models/tag");
// var Category    = require("../models/category");
var middleware  = require("../middleware");

//INDEX form
router.get("/", function(req, res){
    Blogpost.find({}, function(err, allPosts){
        if(err){
            console.log(err);
        } else {
            res.render("blogposts/index",{blogposts:allPosts,  host: req.headers.host});
        }
    });
});

//CREATE commit
router.post("/", middleware.isAuthor, function(req, res){
    var author  = {
        id: req.user._id,
        username: req.user.username
    };
    var content = req.body.content.replace(/(\r\n|\n|\r)/gm,"");
    // var category = "";
    var tags =[];
//     for(var i = 0; i < req.body.tags.length; i++){
//         tags.push(req.body.tags[i]._id);
//     }
    var newPost = {
        title: req.body.title,
        postedOn: Date.now(),
        image: req.body.image,
        description: req.body.description,
        author:author,
        // category: category,
        // tags: tags,
        content: content};
    Blogpost.create(newPost, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
             res.redirect("/blogposts");
        }
    });
});

//NEW form
router.get("/new", middleware.isAuthor, function(req, res){
    res.render("blogposts/new");
});

// SHOW form
router.get("/:id", function(req, res){
    Blogpost
        .findById(req.params.id)
        // .populate("tags")
        // .populate("category")
        .exec(function(err, foundEntry){
        if(err){
            console.log(err);
        } else {
            console.log(foundEntry);
            res.render("blogposts/show", {blogpost: foundEntry, host: req.headers.host});
        }
    });
});

//EDIT form
router.get("/:id/edit",
    function(req, res){
    Blogpost.findById(req.params.id)
        // .populate("tags")
        // .populate("category")
        .exec(function(err, foundEntry){
        if(err){
            console.log(err);
        } else {
            res.render("blogposts/edit", {blogpost: foundEntry});
        }
    });
});

//DELETE commit
router.delete("/:blogpostId",function(req, res){
    Blogpost.findByIdAndRemove(req.params.blogpostId, function(err){
        if(err){
            console.log("PROBLEM during deleting of a post!");
        } else {
            res.redirect("/blogposts/");
        }
    });
});

//EDIT commit
router.put("/:id", function(req, res){

    var updContent  = req.body.content.replace(/(\r\n|\n|\r)/gm,"");
    var updCategory = "";
    var updTags       = [];

    // for(var i = 0; i < req.body.tags.length; i++){
    //     updTags.push(req.body.tags[i]._id);
    // }

    var newData = {
        title       : req.body.title,
        description : req.body.description,
        image       : req.body.image,
        updatedOn   : Date.now(),
        // category    : updCategory,
        // tags        : updTags,
        content     : updContent
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

