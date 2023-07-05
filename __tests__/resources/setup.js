const {
  connectToDatabase,
  mongoose,
  redis,
} = require("../../src/database/connection");

beforeEach(async () => {
  await connectToDatabase();
});
  
afterEach(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await redis.flushdb();
});