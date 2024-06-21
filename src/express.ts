import Application from "./Application";
import type Request from "./request";
import type Response from "./response";

export const express = (input: {
  errorHandler?: (error: Error, req: Request, res: Response) => void;
}) => {
  return Application.getInstance({
    errorHandler: input.errorHandler,
    });
};
