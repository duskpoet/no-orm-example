import { IncomingMessage, ServerResponse } from "http";
import { Repository } from "../types/dbAdapter";

export const apiHandler =
  <T>(repo: Repository<T>) =>
  async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url, "http://localhost");
    const [,subject, id] = url.pathname.split("/");
    if (subject !== repo.name()) {
      return false;
    }

    const body = await new Promise((resolve) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(null);
        }
      });
    });

    const data = await (async () => {
      if (!id && req.method === "GET") {
        const filters = (() => {
          try {
            return JSON.parse(url.searchParams.get('filters'));
          } catch {
            return [];
          }
        })();
        return repo.readMany(filters ?? []);
      }
      if (id && req.method === "GET") {
        return repo.read(id);
      }
      if (!id && req.method === "POST") {
        return repo.create(body as any);
      }
      if (id && req.method === "PUT") {
        return repo.update(id as any, body as any);
      }
      if (id && req.method === "DELETE") {
        return repo.delete(id as any);
      }
    })();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
    return true;
  };
