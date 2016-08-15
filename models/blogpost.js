var mongoose = require("mongoose");

var blogpostSchema = mongoose.Schema({
    title  : String,
    date   : Date,
    level  : Number,
    image  : String,
    description : String,
    author : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    content: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Blogpost", blogpostSchema);