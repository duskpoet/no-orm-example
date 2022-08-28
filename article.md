# Backend without ORM

## Few words about ORM

ORM (Object-relational mapping) is a programming technique that allows you to map data from external storage (such as databases) to your local programming objects.
This approach allows developers to abstract from database specificities and to perform CRUD operations as common function calls. This is beneficial since we don't have to know actual database syntax, some ORMs can even work on SQL and NoSQL databases simultaneously.
But this article's title doesn't say "Why everyone should always ORMs", so I want to point out the downsides of ORMs and suggest an alternative approach.

## Why you don't need ORM

### Communication with database
The lowest level representation of the database data is pure bytes (well it's actually electrons stored and moved in wires and semiconductors if we go all the way down, but we will stay in the software field). So when any driver talks to the actual database over the network it sends and receives packets of bytes. Further, based on the database protocol, which describes how to read and process these bytes, the driver transforms the bytes into meaningful data structures. So, as we can see, the database driver works sort of like an ORM here: it maps the raw data into your programming language constructs. And ORM maps this data even further into different constructs. The data received from the driver is ready to be used in your application. That is the first point on why you don't need ORM.

### Raw data is powerful
So you read some data from the database and you get arrays (or lists, or sequences, or an iterator, depending on your language and driver of choice) in return. Right of the box, you have powerful tools to work with that data, because your standard library contains many functions that work on arrays and maps. On contrary, these functions may or may not work on ORM-specific objects. Also, raw data is perfectly serializable and is ready to be transferred via wire.

### Does your ORM support tests
When you write unit tests for entities that work with your stored data, ideally you want to be ignorant of the database layer. Raw data is decoupled from its origin by nature and can be mocked as you prefer.
ORM, on the other hand, is dependent on its implementation and may support some mock storage, otherwise, you have to always execute tests in front of some database.

### ORM libraries authors don't know about your domain
But you do. Sometimes more specific solutions can be beneficial for your project. Maybe there is some addition to the generated SQL, that can vastly improve the speed of querying.

### Databases can be complex
Beyond simple CRUD operations database can support many amazing features, like sharding, different index types, non-standard conditional operators, and non-standard built-in functions. Probably an ORM library lacks the support for many features of the database you are using.
Also, if you pick an ORM library and build upon it, you are tieing yourself with that library and at some point, if there is a database solution that may be beneficial to your application domain, you may end up in a situation where you need to massively rework your codebase.

### Rich said that ORM is bad
Seriously, if you haven't seen ["Simple made easy"](https://www.youtube.com/watch?v=SxdOUGdseq4) talk by Rich Hickey, do yourself a favor, it's very enlightening.

## How to build without ORM

Let's figure out how to build our projects with the "no ORM" approach. We want to build a solution that is testable separately from the database, operates on data, and has layers with well-defined boundaries (kudos to [Uncle Bob](https://www.youtube.com/watch?v=o_TH-Y78tt4)).
I will build an example using node, typescript, and neon (postgres). It will contain a single entity - `User` with attributes `name` and `age`.

### Model layer

So how do we represent a model within our concept? It's just an interface!
[link](./src/models/user.ts)

```
export type User = {
  id: number;
  name: string;
  age: number;
};
```

If later we want to add some methods, that operate on `User` somehow, then we just write a function that accepts `User` as a parameter or returns a `User` shaped object.
Now we want to connect the `User` entity to the database: store it, retrieve it, modify and delete it.

### Repository layer
Now let's add the entity `Repository`. It will have CRUD methods that operate on raw data and will perform database operations.
[link](./src/types/dbAdapter.ts)

```
export type Repository<T extends Record<string, any>> = {
  name(): string;
  create(data: Omit<T, "id">): Promise<T>;
  readMany<K extends keyof T>(filters: Filter<T, K>[]): Promise<T[]>;
  read(id: string): Promise<T>;
  update(id: string, data: T): Promise<T>;
  delete(id: string): Promise<T>;
};
```
The `Repository` is our missing database operations layer. It can perform all of the "get, store data" stuff. Also, if some entities require additional operations we can extend the basic `Repository` for them with additional operations like `createOrReplace` or `updateMany`.

### Database adapter
Database adapter would be the function that returns a `Repository` instance. Here is an example of how it can look for the postgres database. [link](./src/db/adapter.ts)

If we want to test an adapter we probably would do it against a real database in a snapshot manner with something like these steps:
* Create a test repository using the tested adapter
* Run some methods
* Check that the database state matches our expectations

[link](./src/db/adapter.test.ts)


### Our Repository is pretty useful
Actually, our Repository instance is not only good for database management. For example, we can build REST API from it. [link](./src/server/generateApi.ts)
And write a test for that implementation as well. [link](./src/server/generateApi.test.ts)

## Conclusions

### I gotta be honest
Fairly, the current state of ORMs is not as bad as it was before. There are modern frameworks like Prisma, that acknowledge some of the problems I described above.
For example, Prisma generates a client, that returns just typed data when using built-in query methods, so it is decoupled by design.
I'd say it is a good sign when you can view the database framework as an advanced driver.
Still, using Prisma makes it very hard to migrate to an unsupported database, so you need to keep that in mind.

### The TL;DR
Probably the main thought I want to convey is: design layers of your application in advance and with thinking ahead. And since it's almost impossible to predict the functionalities your application should provide in five years, two years, or one year you need to create a very flexible architecture, and layering your designs with well-defined boundaries is the best approach from what I know.
