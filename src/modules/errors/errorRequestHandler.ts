import { ErrorRequestHandler } from "express";
import { ERROR_TYPE } from "./errorTypes";

const ERROR_TYPE_VS_STATUS = {
  [ERROR_TYPE.AUTH]: 401,
  [ERROR_TYPE.INPUT]: 400,
};

export const errorRequestHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  //log the error
  console.log("Error caught in the ErrorRequestHandler", err);

  res.status(ERROR_TYPE_VS_STATUS[err.type] ?? 500).json({
    message: "Oops!! Something went wrong please try again.",
  });
};
