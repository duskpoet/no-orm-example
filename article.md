# Backend without ORM

## Few words about ORM

ORM (Object–relational mapping) is a programming technique that allows you to map data from external storages (such as databases) to your local programming objects.
This approach allows developers to abstract from database spicificities and do CRUD operations as common function calls. This is obvisously beneficial, since we don't have to know actual database syntax, some ORMs can even work on SQL and NoSQL databases simultaneously.
But this article's title doesn't say "Why everyone should always ORMs", so I want to point out downsides of ORM and suggest an alternative approach.

## Why you don't need ORM

### Communication with database
The lowest level representation of the database data is pure bytes (well it's actually electrons stored and moved in wires and semiconductors if we go all the way down, but we will stay in the software field). So when any db driver talks to the actual database over the network it sends and receives packets with bytes. Further, based on the db protocol, which describes how to read and process these bytes, db driver transforms the bytes into meaningful data structures. So, as we can see, the db driver works sort of like an ORM here: it maps the raw db data into your programming language constructs. And ORM maps this data further into different constructs. The data received from the driver is ready to be used in your application. That is the first point why you don't need ORM.

### Raw data is powerful
So you scan some data from db and you get arrays (or lists, or sequences, or iterator, depends on your language of choice) in return. Right of the box you have powerful tools to work with that data, because your standard library contains many functions that work on arrays, maps. On contrary they may or may not work on ORM specific objects. Raw data also is perfectly serializable and is ready to be transferend via wire.

### Does your ORM support tests
When you write unit tests for entities that use your representation of a stored data, ideally you want to be ignorant of the database layer. So when you work with raw data it is totally decoupled from it's origin by nature and can be mocked as you prefer.
ORM on the other hand is dependant on it's implementation and may support some mock storage, otherwise you have to always execute tests in front of some database.