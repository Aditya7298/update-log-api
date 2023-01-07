import { Product, Update, UpdatePoint } from "@prisma/client";
import db from "../db";
import { getUpdateObjFromDb, authorizeUpdate } from "./update";
import _pick from "lodash/pick";

type UpdatePointWithProductInfo = UpdatePoint & {
  update: Update & {
    product: Product;
  };
};

const authorizeUpdatePoint = (
  updatePoint: UpdatePointWithProductInfo,
  userId: string
) => {
  if (!updatePoint) {
    return "This update point does not exist.";
  }

  if (updatePoint.update.product.belongsToId !== userId) {
    return "You do not have access to this update point.";
  }
};

const getUpdatePointObjFromDb = async (
  updatePointId: string
): Promise<UpdatePointWithProductInfo> => {
  const updatePoint = await db.updatePoint.findUnique({
    where: {
      id: updatePointId,
    },
    include: {
      update: {
        include: {
          product: true,
        },
      },
    },
  });

  return updatePoint;
};

export const createUpdatePoint = async (req, res) => {
  const userId = req.user.id;
  const { updateId, name, description } = req.body;

  const update = await getUpdateObjFromDb(updateId);
  const errorMessage = authorizeUpdate(update, userId);

  if (errorMessage) {
    res.status(400).json({
      message: errorMessage,
    });
    return;
  }

  const updatePoint = await db.updatePoint.create({
    data: {
      name,
      description,
      updateId,
    },
  });

  res.status(200).json({
    data: updatePoint,
  });
};

export const getUpdatePoints = async (req, res) => {
  const userId = req.user.id;

  const updatePoints = await db.updatePoint.findMany({
    where: {
      update: {
        product: {
          belongsToId: userId,
        },
      },
    },
    include: {
      update: {
        include: {
          product: true,
        },
      },
    },
  });

  res.status(200).json({
    data: updatePoints ?? [],
  });
};

export const getUpdatePoint = async (req, res) => {
  const userId = req.user.id;

  const updatePoint = await getUpdatePointObjFromDb(req.params.id);

  const errorMessage = authorizeUpdatePoint(updatePoint, userId);
  if (errorMessage) {
    res.status(400).json({ message: errorMessage });
    return;
  }

  res.status(200).json({ data: updatePoint });
};

export const editUpdatePoint = async (req, res) => {
  const userId = req.user.id;
  const { name, description, id } = req.params;

  const updatePoint = await getUpdatePointObjFromDb(id);

  const errorMessage = authorizeUpdatePoint(updatePoint, userId);
  if (errorMessage) {
    res.status(400).json({ message: errorMessage });
    return;
  }

  const updateUpdatePoint = await db.updatePoint.update({
    where: {
      id,
    },
    data: {
      ..._pick(updatePoint, ["name", "description"]),
      name,
      description,
    },
  });

  res.status(200).json({
    data: updateUpdatePoint,
  });
};

export const deleteUpdatePoint = async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;

  const updatePoint = await getUpdatePointObjFromDb(id);

  const errorMessage = authorizeUpdatePoint(updatePoint, userId);
  if (errorMessage) {
    res.status(400).json({ message: errorMessage });
    return;
  }

  await db.updatePoint.delete({
    where: {
      id,
    },
  });

  res.status(200).json({
    data: true,
  });
};
