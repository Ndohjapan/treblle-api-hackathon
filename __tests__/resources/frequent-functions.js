const request = require("supertest");
const { User } = require("../../src/database/model");
const mockData = require("./mock-data");
const {app} = require("../../src/app");
const userCredentials = {username: "Ndohjapan", password: "P4ssword@"};

let cookie;

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

const userLogin = async(user = userCredentials)=> {
  let agent = await request(app).post("/api/1.0/login").send(user);

  cookie = agent.headers["set-cookie"];
  return cookie;

};



module.exports = {addUser, userLogin};