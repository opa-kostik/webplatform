var mongoose = require("mongoose");

var blogpostSchema = mongoose.Schema({
    title       : String,
    postedOn    : Date,
    updatedOn   : Date,
    image       : String,
    description : String,
    author      : {
                    id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                    },
                    username: String
                },
    // tags        : [
    //                 {
    //                     type: mongoose.Schema.Types.ObjectId,
    //                     ref: "Tag"
    //                 }
    //             ],
    // category    :{
    //                 type: mongoose.Schema.Types.ObjectId,
    //                 ref: "Category"
    //             },
    content     : String

});

module.exports = mongoose.model("Blogpost", blogpostSchema);