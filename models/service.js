var mongoose = require("mongoose");

var serviceSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    content: String
});

module.exports = mongoose.model("Service", serviceSchema);