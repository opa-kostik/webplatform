var express = require("express");
var router  = express.Router({mergeParams: true});
var Blogpost = require("../models/blogpost");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//get new
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find blog by id
    console.log(req.params.id);
    Blogpost.findById(req.params.id, function(err, found){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {blogpost_id: found._id});
        }
    })
});

//post new
router.post("/",middleware.isLoggedIn,function(req, res){
    //lookup blog using ID
    Blogpost.findById(req.params.id, function(err, found){
        if(err){
            console.log(err);
            res.redirect("/blogposts");
        } else {
            var newComment = {
                author: {
                    id: req.user._id,
                    username: req.user.username
                },
                created_on: Date.now(),
                text: req.body.text
            };

            Comment.create(newComment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    found.comments.push(comment);
                    found.save();
                    console.log(comment);
                    res.redirect('/blogposts/' + found._id);
                }
            });
        }
    });
});

//get edit
router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
    // find by id
    Comment.findById(req.params.commentId, function(err, found){
        if(err){
            console.log(err);
        } else {
            res.render("comments/edit", {blogpost_id: req.params.id, comment: found});
        }
    })
});

//post edit
router.put("/:commentId", function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, { $set: { text: req.body.text }}, function(err, comment){
        if(err){
            res.render("edit");
        } else {
            res.redirect("/blogposts/" + req.params.id);
        }
    });
});

//post delete
router.delete("/:commentId",middleware.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            console.log("PROBLEM!");
        } else {
            res.redirect("/blogposts/" + req.params.id);
        }
    })
});

module.exports = router;