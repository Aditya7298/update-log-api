import { Product } from "@prisma/client";
import db from "../db";

export const authorizeProduct = (product: Product, userId: string) => {
  if (!product) {
    return "This product does not exist.";
  }

  if (product.belongsToId !== userId) {
    return "You do not have access to this product";
  }
};

export const getProducts = async (req, res) => {
  const user = await db.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      product: true,
    },
  });

  res.status(200).json({
    data: user.product ?? [],
  });
};

export const getProduct = async (req, res) => {
  const product = await db.product.findUnique({
    where: {
      id: req.params.id,
    },
  });

  const errorMessage = authorizeProduct(product, req.user.id);

  if (errorMessage) {
    res.status(400).json({ message: errorMessage });
    return;
  }

  res.status(200).json({
    data: product,
  });
};

export const createProduct = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    const product = await db.product.create({
      data: {
        name,
        belongsToId: user.id,
      },
    });

    res.status(200).json({
      data: product,
    });
  } catch (e) {
    next(e);
  }
};

export const updateProduct = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;
  const productId = req.params.id;

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

  const updatedProduct = await db.product.update({
    where: {
      id: productId,
    },
    data: {
      name,
    },
  });

  res.status(200).json({
    data: updatedProduct,
  });
};

export const deleteProduct = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;

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

  await db.product.delete({
    where: {
      id: productId,
    },
  });

  res.status(200).json({
    data: {
      deleted: true,
    },
  });
};
