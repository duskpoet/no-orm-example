import { apiHandler } from "./generateApi";

import { Repository } from "../types/dbAdapter";
import * as http from "http";

class Test {
  name: string;
}

const PORT = 3000;

describe("generateApi", () => {
  let testServer: http.Server;
  afterEach(() => {
    testServer?.close();
  });

  test("apiHandler", async () => {
    const testRepo: Repository<Test> = {
      name: () => "tests",
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      read: jest.fn(),
      readMany: jest.fn(),
    };
    testServer = http.createServer(async (req, res) => {
      const handler = apiHandler(testRepo);
      if (!(await handler(req, res))) {
        res.statusCode = 404;
        res.end();
      }
    });
    await new Promise((resolve) =>
      testServer.listen(PORT, () => resolve(true))
    );

    // GET /tests
    await new Promise((resolve) => {
      http
        .get(`http://localhost:${PORT}/tests`, (res) => {
          expect(res.statusCode).toBe(200);
          expect(testRepo.readMany).toHaveBeenCalled();
          resolve(true);
        })
        .on("error", console.error);
    });

    // POST /tests
    await new Promise((resolve) => {
      const req = http.request(
        `http://localhost:${PORT}/tests`,
        {
          method: "POST",
        },
        (res) => {
          expect(res.statusCode).toBe(200);
          expect(testRepo.create).toHaveBeenCalled();
          resolve(true);
        }
      );
      req.write(JSON.stringify({ name: "test" }));
      req.end();
    });

    // GET 404
    await new Promise((resolve) => {
      http
        .get(`http://localhost:${PORT}/unknown`, (res) => {
          expect(res.statusCode).toBe(404);
          resolve(true);
        })
        .on("error", console.error);
    });
  });
});
