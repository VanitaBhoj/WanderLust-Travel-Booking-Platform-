const express = require("express");
const app = express();
const ExpressError=require("./expressError");

const checkToken=(req,res,next)=>{
    let {token}=req.query;
    if(token=="giveaccess"){
        next();
    } 
    throw new ExpressError(401,"ACCESS DENIED!");
};

// // Route handlers
// app.get("/api", (req, res) => {
//     res.send("data");
// });

app.get("/api",checkToken,(req,res)=>{
    res.send("data");
})

app.get("/", (req, res) => {
    res.send("Hi, I am root.");
});

app.get("/random", (req, res) => {
    res.send("This is a random page");
});
app.get("/err",(req,res)=>{
    abcd=abcd;
});
app.get("/admin",(req,res)=>{
    throw new ExpressError(403,"Access to admin is Forbidden");
})
app.use((err,req,res,next)=>{
    let {status = 500,message="Some Error Occurred"}=err;
    res.status(status).send(message);
});
app.listen(8080, () => {
    console.log("Server listening on port 8080");
});

// // Middleware for "/random"
// app.use("/random", (req, res, next) => {
//     console.log("I am only for random");
//     next();
// });

// // 404 Middleware (should be last)
// app.use((req, res) => {
//     res.status(404).send("Page not found");
// });
// // Logger middleware (should be at the top)
// app.use((req, res, next) => {
//     req.time = Date.now();
//     console.log(req.method, req.hostname, req.path, req.time);
//     next();
// });

