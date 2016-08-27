var express = require("express");
var router  = express.Router();
var Category = require("../models/category");
var middleware = require("../middleware");

//INDEX - show all
router.get("/", function(req, res){
    // Get all entries from DB
    Category.find({}, function(err, foundEntries){
        if(err){
            console.log(err);
        } else {
            res.render("categories/index",{categories:foundEntries});
        }
    });
});

//CREATE - add new entry to DB
router.post("/", function(req, res) {
    var newData = {
        name: req.body.name,
        urlSlug: req.body.urlSlug,
        description: req.body.description
    };
    // Create a new entry and save to DB
    if (!req.body.id) {
        Category.create(newData, function (err, newlyCreated) {
            if (err) {
                console.log(err);
            } else {
                console.log("successfully created: " + newlyCreated._id);
                res.json({ category: newlyCreated });
            }
        });
    } else {
        Category.findByIdAndUpdate(req.body.id, {$set: newData}, function (err, updEntry) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                console.log("successfully updated: " + updEntry._id);
                res.json({ category: updEntry });
            }
        });
    }
});

router.delete("/:catId",function(req, res){
    Category.findByIdAndRemove(req.params.catId, function(err){
        if(err){
            console.log("Deleting - ERROR!");
            console.log(err);
        } else {
            console.log("Deleting - OK!");
            res.json({ message: 'Successfully deleted' });
        }
    });
});

module.exports = router;

