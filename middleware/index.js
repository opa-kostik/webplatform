module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
    },
    isAuthor: function(req, res, next){
        if(req.isAuthenticated()){
            if(req.user.role === "author" || req.user.role === "admin" ){
                next();
                } else {
                    console.log("User role is not author!");
                    res.redirect("/");
                }
        } else {
            res.redirect("/login");
        }
    }
};