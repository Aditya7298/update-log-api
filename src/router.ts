import { Router } from "express";
import { body } from "express-validator";

import { checkRequestForErrors } from "./modules/errors/checkRequestForErrors";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./handlers/product";
import {
  getUpdate,
  getUpdates,
  createUpdate,
  editUpdate,
  deleteUpdate,
} from "./handlers/update";
import {
  getUpdatePoint,
  getUpdatePoints,
  editUpdatePoint,
  createUpdatePoint,
  deleteUpdatePoint,
} from "./handlers/updatePoint";

import { UPDATE_STATUS } from "./constants";

const router = Router();

/**
 * Product
 */
router.get("/product", getProducts);
router.get("/product/:id", getProduct);
router.patch(
  "/product/:id",
  body("name").isString(),
  checkRequestForErrors,
  updateProduct
);
router.post(
  "/product",
  body("name").isString(),
  checkRequestForErrors,
  createProduct
);
router.delete("/product/:id", deleteProduct);

/**
 * Update
 */
router.get("/update", getUpdates);
router.get("/update/:id", getUpdate);
router.patch(
  "/update/:id",
  body(["title", "body", "version", "asset", "productId"])
    .optional()
    .isString(),
  body("status").isIn(Object.values(UPDATE_STATUS)),
  checkRequestForErrors,
  editUpdate
);
router.post(
  "/update",
  body(["title", "body", "productId"]).isString(),
  body(["version", "asset"]).optional().isString(),
  body("status").optional().isIn(Object.values(UPDATE_STATUS)),
  checkRequestForErrors,
  createUpdate
);
router.delete("/update/:id", deleteUpdate);

/**
 * UpdatePoint
 */
router.get("/updatepoint", getUpdatePoint);
router.get("/updatepoint/:id", getUpdatePoints);
router.patch(
  "/updatepoint/:id",
  body("name").optional().isString(),
  body("description").optional().isString(),
  checkRequestForErrors,
  editUpdatePoint
);
router.post(
  "/updatepoint",
  body("name").isString(),
  body("description").isString(),
  body("updateId").isString(),
  checkRequestForErrors,
  createUpdatePoint
);
router.delete("/updatepoint/:id", deleteUpdatePoint);

export { router };
