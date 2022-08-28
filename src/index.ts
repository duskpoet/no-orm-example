import "dotenv/config";

import * as http from "http";
import { apiHandler } from "./server/generateApi";
import { userRepository } from "./db/user";

const userHandler = apiHandler(userRepository);

const server = http.createServer(async (req, res) => {
  if (!(await userHandler(req, res))) {
    res.writeHead(404);
    res.end();
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});
