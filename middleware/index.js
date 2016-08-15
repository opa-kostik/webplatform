var Comment = require("../models/comment");
var WorkExample = require("../models/service");
module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
    },
    checkUserIsAuthor: function(req, res, next){
        if(req.isAuthenticated()){
            if(req.user.role == "author" || req.user.role == "superuser" ){
                next();
                } else {
                    // req.flash("error", "You don't have permission to do that!");
                    console.log("User role is not author!");
                    res.redirect("/");
                }
        } else {
            res.redirect("/login");
        }
    },
    checkUserComment: function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.commentId, function(err, comment){
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("/");
                }
            });
        } else {
            res.redirect("login");
        }
    }
}