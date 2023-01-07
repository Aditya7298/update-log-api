import { Update, Product } from "@prisma/client";
import _omit from "lodash/omit";
import db from "../db";
import { authorizeProduct } from "./product";

export const authorizeUpdate = (
  update: Update & {
    product: Product;
  },
  userId: string
): string | undefined => {
  if (!update) {
    return "This update does not exist.";
  }

  if (update.product.belongsToId !== userId) {
    return "You do not have access to this update.";
  }
};

export const getUpdateObjFromDb = async (
  updateId: string
): Promise<Update & { product: Product }> => {
  return await db.update.findUnique({
    where: {
      id: updateId,
    },
    include: {
      product: true,
    },
  });
};

export const createUpdate = async (req, res) => {
  const { title, body, productId, version, asset, status } = req.body;
  const userId = req.user.id;

  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });

  const errorMessage = authorizeProduct(product, userId);

  if (errorMessage) {
    res.status(400).json({ message: errorMessage });
    return;
  }

  const update = await db.update.create({
    data: {
      title,
      body,
      version,
      asset,
      productId,
      status,
    },
  });

  res.status(200).json({
    data: update,
  });
};

export const getUpdates = async (req, res) => {
  const userId = req.user.id;

  const updates = await db.update.findMany({
    where: {
      product: {
        belongsToId: userId,
      },
    },
  });

  res.status(200).json({ data: updates ?? [] });
};

export const getUpdate = async (req, res) => {
  const userId = req.user.id;

  const update = await getUpdateObjFromDb(req.params.id);

  const errorMessage = authorizeUpdate(update, userId);

  if (errorMessage) {
    res.status(400).json({ message: errorMessage });
    return;
  }

  res.status(200).json({ message: update });
};

export const editUpdate = async (req, res) => {
  const userId = req.user.id;
  const { title, body, productId, version, asset, status } = req.body;

  const update = await getUpdateObjFromDb(req.params.id);

  const errorMessage = authorizeUpdate(update, userId);

  if (errorMessage) {
    res.status(400).json({ message: errorMessage });
    return;
  }

  const newUpdate = await db.update.update({
    where: {
      id: req.params.id,
    },
    data: {
      ..._omit(update, "product"),
      title,
      body,
      productId,
      version,
      asset,
      status,
    },
  });

  res.status(200).json({
    data: newUpdate,
  });
};

export const deleteUpdate = async (req, res) => {
  const userId = req.user.id;
  const updateId = req.params.id;

  const update = await getUpdateObjFromDb(updateId);

  const errorMessage = authorizeUpdate(update, userId);

  if (errorMessage) {
    res.status(400).json({ message: errorMessage });
    return;
  }

  await db.update.delete({
    where: {
      id: updateId,
    },
  });

  res.status(200).json({
    data: {
      deleted: true,
    },
  });
};
