// const mongoose = require("mongoose");

// const connectDB = async()=>{
//     try{
//         await mongoose.connect(process.env.MONGO_URL);
//         console.log("MOngoose connected")
//     } catch(error){
//         console.log("Error occured at the connection of the mongoDB: ", error);
//         process.exit(1);
//     }
// }
// module.exports = connectDB;


const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
])

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        console.log("MongoDB Connected");

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB Error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB Disconnected");
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}
module.exports = connectDB;