// seed.js
const { connectToDatabase, mongoose } = require("./connection");
const { User } = require("./model");
const seedData = require("./seedData");

async function up() {

  try {
    
    await connectToDatabase();


    // Insert seed data into the collection
    await User.create(seedData.users); 

    console.log("Seeding completed successfully");
  } catch (err) {
    console.error("Error seeding the database:", err);
  } finally {
    await mongoose.connection.close();
  }
}

async function down() {

  try {
    await connectToDatabase();

    await mongoose.connection.dropDatabase();

    console.log("Data removal completed successfully");
  } catch (err) {
    console.error("Error removing data from the database:", err);
  } finally {
    await mongoose.connection.close();
  }
}

// Run the "up" or "down" function based on the command-line argument
// eslint-disable-next-line no-undef
if (process.argv[2] === "up") {
  up();
// eslint-disable-next-line no-undef
} else if (process.argv[2] === "down") {
  down();
} else {
  console.error("Invalid command. Please specify either \"up\" or \"down\".");
}
