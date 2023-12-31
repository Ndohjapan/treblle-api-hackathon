const request = require("supertest");
const { User, UserConnection } = require("../../src/database/model");
const mockData = require("./mock-data");
const { app } = require("../../src/app");
const userCredentials = { username: "Ndohjapan", password: "P4ssword@" };

let cookie;
let token;

const addUser = async (num = 1, user = mockData.user1) => {
  const users = [user];

  for (let index = 1; index < num; index++) {
    users.push({
      ...user,
      firstname: "Joel" + index,
      lastname: "Ndoh" + index,
      username: "Ndohjapan" + index,
    });
  }

  const data = await User.create(users);
  return data;
};

const userLogin = async (user = userCredentials) => {
  let agent = await request(app).post("/api/1.0/login").send(user);

  cookie = agent.headers["set-cookie"];
  token = agent.body.token;
  return {cookie, token};
};

const createUserConnection = async (user1, user2) => {
  const userConnection = await UserConnection.create({ users: [user1, user2] });

  return userConnection;
};

module.exports = { addUser, userLogin, createUserConnection };
