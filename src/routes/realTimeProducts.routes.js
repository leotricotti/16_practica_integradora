import { Router } from "express";
import { getAll, getOne } from "../controllers/products.controller.js";
import {
  saveProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/realTimeProducts.controller.js";
import { uploader } from "../utils/index.js";

//Inicializar servicios
const router = Router();

// Ruta que obtine todos los productos
router.get("/", getAll);

//Ruta para obtener un producto
router.get("/:pid", getOne);

//Ruta para guardar un producto
router.post(
  "/",
  uploader.fields([{ name: "userProductImage", maxCount: 3 }]),
  saveProduct
);

//Ruta para actualizar un producto
router.put(
  "/:pid",
  uploader.fields([{ name: "userProductImage", maxCount: 3 }]),
  updateProduct
);

//Ruta para eliminar un producto
router.delete("/:pid", deleteProduct);

export default router;
