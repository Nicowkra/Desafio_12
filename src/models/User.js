import mongoose from "mongoose";
const userCollection = "users";

const userSchema = new mongoose.Schema(
    {
        name: { type:String },
        username: {type: String, required:true},
        password: {type: String, required: true}
    }
)

const User = mongoose.model(userCollection, userSchema);

export default User