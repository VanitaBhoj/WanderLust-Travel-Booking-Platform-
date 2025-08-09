const mongoose =require("mongoose");
const Schema =mongoose.Schema;

const listingSchema=new Schema({
    title:{
       type: String,
       required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1588001832198-c15cff59b078?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9",
        set:(v)=>
            v===""?"https://images.unsplash.com/photo-1588001832198-c15cff59b078?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9"
                       :v,
    },
    price:{
        type:Schema.Types.Mixed,
        required:true,
    },
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ]
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;