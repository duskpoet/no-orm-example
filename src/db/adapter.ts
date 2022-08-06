import { Pool } from "pg";
import { Repository, ModelConstructor } from "../types/dbAdapter";

const pool = new Pool();

export function pgAdapter<T>(ModelClass: ModelConstructor<T>): Repository<T> {
  const tableName = ModelClass.name.toLowerCase() + "s";

  return {
    name: () => tableName,

    create: async (data) => {
      const keys = Object.keys(data);
      const result = await pool.query(
        `INSERT INTO ${tableName} (${keys
          .map((k) => `${k}`)
          .join(", ")}) VALUES (${keys
          .map((_, idx) => `$${idx + 1}`)
          .join(", ")}) RETURNING *`,
        Object.values(data)
      );
      return result.rows[0];
    },
    readMany: async (...filters) => {
      const where = filters
        .map((filter) => {
          switch (filter.operator) {
            case "=":
              return `${String(filter.field)} = $${filter.value}`;
          }
        })
        .join(" AND ");
      const query = `SELECT * FROM ${tableName} ${
        where ? `WHERE ${where}` : ""
      }`;
      const result = await pool.query(query);
      return result.rows;
    },
    read: async (id) => {
      const result = await pool.query(
        `SELECT * FROM ${tableName} WHERE id = $1`,
        [id]
      );
      return result.rows[0];
    },
    update: async (id, data) => {
      const keys = Object.keys(data);
      const result = await pool.query(
        `UPDATE ${tableName} SET ${keys
          .map((k, idx) => `${k} = $${idx + 2}`)
          .join(", ")}
          WHERE id = $1 RETURNING *`,
        [id, ...Object.values(data)]
      );
      return result.rows[0];
    },
    delete: async (id) => {
      const result = await pool.query(
        `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0];
    },
  };
}
