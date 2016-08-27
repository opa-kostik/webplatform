var express     = require("express");
var router      = express.Router();
var Blogpost    = require("../models/blogpost");
var Category    = require("../models/category");
var middleware  = require("../middleware");

//INDEX form
router.get("/", function(req, res){
    var response = {};

    Blogpost.find().exec()
    .then(function(allPosts) {
        response.blogposts = allPosts;
        return Blogpost.aggregate([{ $group:  {_id: '$category', count: {$sum: 1}}}])
            .exec();
    })
    .then(function(catCounts){
        response.counts = catCounts;
        return Category.find().exec();
    })
    .then(function(categories) {
        for (var i = 0; i < response.counts.length; i++) {
            for (var j = 0; j < categories.length; j++) {
                if(response.counts[i]._id && response.counts[i]._id.id === categories[j]._id.id){
                    response.counts[i].name = categories[i].name;
                    response.counts[i].urlSlug = categories[i].urlSlug;
                }
            }
        }
        res.render("blogposts/index", {data: response});
    })
    .catch(function(err){
            console.log(err);
    });
});

router.get("/cat/:catId", function(req, res){
    var response = {};
    Blogpost.find({category: req.params.catId}).exec()
    .then(function(catPosts){
        response.blogposts = catPosts;
        return Blogpost.aggregate([{ $group:  {_id: '$category', count: {$sum: 1}}}]).exec();
    })
    .then(function(catCounts){
        response.counts = catCounts;
        return Category.find().exec();
    })
    .then(function(categories) {
        for (var i = 0; i < response.counts.length; i++) {
            for (var j = 0; j < categories.length; j++) {
                if(response.counts[i]._id && response.counts[i]._id.id === categories[j]._id.id){
                    response.counts[i].name = categories[i].name;
                    response.counts[i].urlSlug = categories[i].urlSlug;
                }
            }
        }
        res.render("blogposts/index", {data: response});

    })
    .catch(function(err){
        console.log(err);
    });
});

//CREATE commit
router.post("/", middleware.isAuthor, function(req, res){
    var author  = {
        id: req.user._id,
        username: req.user.username
    };
    var content = req.body.content.replace(/(\r\n|\n|\r)/gm,"");
    var category = req.body.category;
    var newPost = {
        title: req.body.title,
        postedOn: Date.now(),
        image: req.body.image,
        description: req.body.description,
        author:author,
        category: category,
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
    Category.find({}, function(err, allCats) {
        if (err) {
            console.log(err);
        } else {
            res.render("blogposts/new", {categories: allCats});
        }
    });
});

// SHOW form
router.get("/:id", function(req, res){

    var response = {};
    response.host = req.headers.host;

    Blogpost.findById(req.params.id)
            .populate("category")
            .exec()
    .then(function(foundPost) {
        response.blogpost = foundPost;
        return Blogpost.aggregate([{ $group:  {_id: '$category', count: {$sum: 1}}}])
            .exec();
    })
    .then(function(catCounts) {
        response.counts = catCounts;
        return Category.find().exec();
    })
    .then(function(categories) {
        for (var i = 0; i < response.counts.length; i++) {
            for (var j = 0; j < categories.length; j++) {
                if(response.counts[i]._id && response.counts[i]._id.id === categories[j]._id.id){
                    response.counts[i].name = categories[i].name;
                    response.counts[i].urlSlug = categories[i].urlSlug;
                }
            }
        }

        response.categories = categories;
        res.render("blogposts/show", {data: response});
    })
    .catch(function(err){
        console.log(err);
    });
});

//EDIT form
router.get("/:id/edit",
    function(req, res){
    Blogpost.findById(req.params.id)
        .populate("category")
        .exec(function(err, foundEntry){
        if(err){
            console.log(err);
        } else {
            Category.find({}, function(err, allCats) {
                if (err) {
                    console.log("error: " + err);
                } else {
                    res.render("blogposts/edit", {blogpost: foundEntry, categories: allCats});
                }
            });
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
    var updCategory = req.body.category;
    var newData = {
        title       : req.body.title,
        description : req.body.description,
        image       : req.body.image,
        updatedOn   : Date.now(),
        category    : updCategory,
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