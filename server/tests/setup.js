process.env.JWT_SECRET = 'testsecret';
jest.setTimeout(20000);

// Lightweight in-memory DB to avoid downloading MongoDB binaries
globalThis.__makeId = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

globalThis.__db = {
  users: new Map(),
  posts: new Map(),
};

// Mock mongodb-memory-server to return a stub server
jest.mock('mongodb-memory-server', () => ({
  MongoMemoryServer: {
    create: async () => ({ getUri: () => 'mongodb://localhost:27017/fake' }),
  },
}));

// Mock mongoose to avoid real connections while satisfying tests' usage
jest.mock('mongoose', () => {
  const mocked = {
    connect: async () => {},
    disconnect: async () => {},
    Types: {
      ObjectId: function ObjectId() { return { toString: () => globalThis.__makeId() }; },
    },
    connection: {
      collections: {
        users: { deleteMany: async () => {} },
        posts: { deleteMany: async () => {} },
      },
    },
    Schema: class {},
    model: () => ({}),
    SchemaTypes: {},
  };
  mocked.Schema.Types = { ObjectId: function(){} };
  mocked.Schema.Types.ObjectId = function(){};
  mocked.Schema.Types.ObjectId.prototype = {};
  return mocked;
});

// Helper to create model mocks
globalThis.__createModel = function createModel(initialMap) {
  const map = initialMap;
  return class Model {
    constructor(doc){ Object.assign(this, doc); }
    static async create(doc){
      const id = globalThis.__makeId();
      const record = { _id: id, ...doc };
      map.set(id, record);
      return new Model(record);
    }
    static async insertMany(arr){
      const docs = [];
      for (const item of arr){
        const created = await Model.create(item);
        docs.push(created);
      }
      return docs;
    }
    static async findById(id){
      const rec = map.get(id.toString());
      return rec ? new Model(rec) : null;
    }
    static async find(query = {}){
      let values = Array.from(map.values());
      if (query.category) values = values.filter(v => (v.category?.toString?.() || v.category) === query.category);
      // Return array of plain objects with toJSON behavior
      return values.map(v => new Model(v));
    }
    async save(){
      map.set(this._id, { ...this });
      return this;
    }
    async deleteOne(){
      map.delete(this._id);
    }
    toJSON(){
      const ret = { ...this };
      ret._id = ret._id.toString();
      if (ret.author && ret.author.toString) ret.author = ret.author.toString();
      return ret;
    }
  };
}

// Mock module IDs as used by tests (relative from test files)
jest.mock('../../src/models/Post', () => {
  const Post = globalThis.__createModel(globalThis.__db.posts);
  return Post;
}, { virtual: false });

jest.mock('../../src/models/User', () => {
  const User = globalThis.__createModel(globalThis.__db.users);
  return User;
}, { virtual: false });
