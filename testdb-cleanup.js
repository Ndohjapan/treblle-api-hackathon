const { MongoClient } = require("mongodb");

const deleteTestDatabases = async () => {
  // MongoDB connection URL
  const url = "mongodb://127.0.0.1:27017";

  // Create a MongoClient
  const client = new MongoClient(url);

  try {
    // Connect to the MongoDB server
    await client.connect();

    // Get the list of database names
    const databaseNames = await client.db().admin().listDatabases();

    // Filter the database names to select the ones starting with "test_"
    const testDatabaseNames = databaseNames.databases.filter(db => db.name.startsWith("test_"));

    // Delete each test database
    for (const database of testDatabaseNames) {
      await client.db(database.name).dropDatabase();
      console.log(`Deleted database: ${database.name}`);
    }
  } catch (error) {
    console.error("Error deleting test databases:", error);
  } finally {
    // Close the MongoClient
    await client.close();
  }
};

// Call the function to delete the test databases
deleteTestDatabases();
