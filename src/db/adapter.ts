import { Pool } from "pg";
import format from "pg-format";

import { Repository } from "../types/dbAdapter";

const pool = new Pool();

export function pgAdapter<T>(tableName: string): Repository<T> {

  return {
    name: () => tableName,

    create: async (data) => {
      const result = await pool.query(
        format(
          `INSERT INTO %I (%I) VALUES (%L) RETURNING *`,
          tableName,
          Object.keys(data),
          Object.values(data)
        )
      );
      return result.rows[0];
    },
    readMany: async (filters) => {
      const where = filters
        .map((filter) => {
          switch (filter.operator) {
            case "=":
              return `%I = %L`;
          }
        })
        .join(" AND ");
      const query = `SELECT * FROM ${tableName} ${
        where ? `WHERE ${where}` : ""
      }`;
      const values = filters.flatMap((filter) => [filter.field, filter.value]);
      const result = await pool.query(format(query, ...values));
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
