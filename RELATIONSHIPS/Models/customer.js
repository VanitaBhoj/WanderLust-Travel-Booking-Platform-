const mongoose =require("mongoose");
const {Schema}=mongoose;

main()
    .then(()=>console.log("connection successful"))
    .catch((err)=>console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/relationDemo");
}

const orderSchema=new Schema({
    item : String,
    price:Number,
});

const customerSchema=new Schema({
    name:String,
    orders:[
        {
            type:Schema.Types.ObjectId,
            ref:"Order"
        }
    ]
});

const Order =mongoose.model("Order",orderSchema);
const Customer =mongoose.model("Customer",customerSchema);

//Functions

const findCustomer=async()=>{
    let res=await Customer.find({}).populate("orders");
    console.log(res[0]);
}

const addCust=async()=>{
    let newCust=new Customer({
        name:"Vanita Bhoj",
    });
    let newOrder=new Order({
        item:"Pizza",
        price:250,
    });
    newCust.orders.push(newOrder);

    await newOrder.save();
    await newCust.save();

    console.log("Added new customer");
}
// addCust();

const delcust=async()=>{
    let data=await Customer.findByIdAndDelete("6863e89274e275e10f4f4448");
    console.log(data);
}

delcust();












// const addCustomer= async()=>{
//     let cust1=new Customer({
//         name:"Rahul Kumar",
//     });
//     let order1= await Order.findOne({item:"Chips"});
//     let order2=await Order.findOne({item:"Chocolate"});

//     cust1.orders.push(order1);
//     cust1.orders.push(order2);

//    let res= await cust1.save();
//    console.log(res);
// }
// addCustomer();












// const addorders=async()=>{
//     let res=await order.insertMany([
//         {
//             item:"Samosa",price:12
//         },
//         {
//             item:"Chips",price:10
//         },
//         {
//             item:"Chocolate",price:40
//         },
//     ]);
//     console.log(res);
// };
// addorders();