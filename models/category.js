var mongoose = require("mongoose");

var categorySchema = mongoose.Schema({
    name        : String,
    description : String,
    urlSlug     : String
});

module.exports = mongoose.model("Category", categorySchema);