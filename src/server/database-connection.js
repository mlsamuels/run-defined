import mongoose from "mongoose"
import dotenv from "dotenv";

export default class DatabaseConnection {

    async connect() {
        dotenv.config();

        await mongoose.connect(process.env.MONGODB_URI, {});

        const db = mongoose.connection;
        db.on("error", (err) => console.log(err));
        this.collection = db.collection("gameZeroSubmissions");
        this.connected=true
    }

    async aggregate(input){
        return this.collection.aggregate(input).toArray();
    }

    async findOne(input){
        return this.collection.findOne(input);
    }

    async updateOne(input1, input2){
        return this.collection.updateOne(input1, input2)
    }

    async insertOne(input){
        return this.collection.insertOne(input);
    }

}