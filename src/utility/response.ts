import { Response } from 'express';

export default function sendResponse(
  res: Response,
  status: boolean,
  code: number,
  message: string,
  data?: any
) {
  res.send({
    status,
    code,
    message,
    data,
  });
}
