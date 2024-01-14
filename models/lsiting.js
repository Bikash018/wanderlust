const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listeningSchema = new Schema({
    title :{
        type: String,
        required : true ,
    },
    description : {
        type :String,
        required : true ,
    },
    image: {
        url : String,
        filename : String,
    },
    price : Number,
    location :String,
    country : String,
    reviews : [
      {
        type : Schema.Types.ObjectId,
        ref : "Review"
      }
    ],
    owner : {
      type : Schema.Types.ObjectId,
      ref : "User"
    }

    

});

const Listing = mongoose.model("Listing" , listeningSchema);
module.exports = Listing