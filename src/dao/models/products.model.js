import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    default: "admin",
  },
  thumbnail: {
    type: Array,
    required: false,
    default: [
      {
        img1: "https://freezedepot.com/wp-content/uploads/2023/05/producto-sin-imagen.png",
      },
    ],
  },
});

productsSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;
