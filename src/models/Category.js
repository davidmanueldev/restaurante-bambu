import {model, models, Schema} from "mongoose";

const CategorySchema = new Schema({
  name: {type:String, required:true},
  type: {type:String, enum: ['main', 'side', 'drink', 'other'], default: 'main'},
}, {timestamps: true});

export const Category = models?.Category || model('Category', CategorySchema);