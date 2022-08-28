import { Pool } from "pg";

import { pgAdapter } from "./adapter";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  allowExitOnIdle: true,
});

type User = {
  id: number;
  name: string;
};

describe("pgAdapter", () => {
  beforeAll(async () => {
    await pool.query(
      `CREATE TABLE users_test (id SERIAL PRIMARY KEY, name VARCHAR(255))`
    );
  });

  afterAll(async () => {
    await pool.query(`DROP TABLE users_test`);
    await pool.end();
  });

  it("should create a repository", () => {
    const repository = pgAdapter("users_test");
    expect(repository.name()).toBe("users_test");
  });

  it("should create a user", async () => {
    const repository = pgAdapter<User>("users_test");
    const user = await repository.create({
      name: "John Doe",
    });
    expect(user.id).toBeDefined();
    expect(
      (await pool.query(`SELECT * FROM users_test WHERE id = $1`, [user.id]))
        .rows
    ).toEqual([
      {
        id: user.id,
        name: "John Doe",
      },
    ]);
  });

  it("should update a user", async () => {
    const repository = pgAdapter<User>("users_test");
    const user = await repository.create({
      name: "John Doe",
    });
    await repository.update(user.id, {
      name: "Jane Doe",
    });
    expect(
      (await pool.query(`SELECT * FROM users_test WHERE id = $1`, [user.id]))
        .rows
    ).toEqual([
      {
        id: user.id,
        name: "Jane Doe",
      },
    ]);
  });

  it("should delete a user", async () => {
    const repository = pgAdapter<User>("users_test");
    const user = await repository.create({
      name: "John Doe",
    });
    await repository.delete(user.id);
    expect(
      (await pool.query(`SELECT * FROM users_test WHERE id = $1`, [user.id]))
        .rows
    ).toEqual([]);
  });
});
