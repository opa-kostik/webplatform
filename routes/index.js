var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
var Blogpost    = require("../models/blogpost");

/* GET home page. */
router.get("/", function(req, res){
    User
    .find({})
    .where('role').in(['author', 'superuser'])
    .exec(function(err, foundAuthors){
        if(err)
            console.log(err);
        else {
            Blogpost.findOne({level: 1}, function (err, foundPost) {
                if (err)
                    console.log(err);
                else
                    res.render("index", {
                        authors: foundAuthors,
                        blogpost: foundPost
                    });
            });
        }
    });
});

// show register form
router.get("/signup", function(req, res){
  res.render("signup");
});

//handle sign up logic
router.post("/signup", function(req, res){
  var newUser = new User({
      username: req.body.username,
      role:     req.body.role,
      avatar:   "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
  });
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      //req.flash("error", err.message);
      return res.render("signup");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/");
    });
  });
});

//show login form
router.get("/login", function(req, res){
  res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login"
        // ,successFlash: "Welcome!",
        // failureFlash: "Invalid username or password!"

    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

//show About page
router.get("/about", function(req, res){
    res.render("about");
});

//show Contact page
router.get("/contacts", function(req, res){
    res.render("contacts");
});

module.exports = router;