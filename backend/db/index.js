import mongoose from "mongoose";


const connectDb=async()=>{
    try {
        
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);

    } catch (error) {

        console.log(" MongoDb connection failed", error)
        process.exit(1);


    }

}

export default connectDb;