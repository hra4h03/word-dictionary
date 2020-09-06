import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string
  username: string,
  picture: string,
  google_id: string
}

const appUser = new Schema<IUser>({
  email: {
    required: true,
    type: String,
    unique: true
  },
  username: {
    required: true,
    unique: true,
    type: String,
  },
  picture: {
    required: false,
    type: String,
  },
  google_id: {
    unique: true,
    required: true,
    type: String
  }
}, { toJSON: { getters: true } })


const UserModel = model<IUser>("AppUser", appUser)
export { UserModel }