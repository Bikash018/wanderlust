const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/lsiting");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    // console.log(initdata);
    initdata.data = initdata.data.map((obj)=>({
        ...obj ,
        owner : "659ba719254ed5a3a4bfb09c",
    }))
    await Listing.insertMany(initdata.data);
    console.log("data was initialised");
}

initDB();
