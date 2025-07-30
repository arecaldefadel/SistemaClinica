import { changePassService, loginService } from "../services/users.service.js";

export const loginController = async (req, res) => {
  const { username, password } = req.body;

  const request = await loginService({ username, password });
  if (request?.error) {
    return res.status(401).json(request.msg);
  }
  return res
    .status(200)
    .json({ error: false, msg: request.msg, data: request.data });
};

export const changePassController = async (req, res) => {
  const { password, newPassword, repeatNewPassword } = req.body;
  const id = req.userId;

  const request = await changePassService({ id, password: newPassword });
  if (request?.error) {
    return res.status(401).json({ error: true, message: request.msg });
  }
  return res
    .status(200)
    .json({ error: false, msg: request.msg, data: request.data });
};
