import { loginService } from "../services/users.service.js";

export const loginController = async (req, res) => {
  const { username, password } = req.body;

  const request = await loginService({ username, password });
  if (request?.error) {
    return res.status(401).json({ error: true, msg: request.msg });
  }
  return res
    .status(200)
    .json({ error: false, msg: request.msg, data: request.data });
};
