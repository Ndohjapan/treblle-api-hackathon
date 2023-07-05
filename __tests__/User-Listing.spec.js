const request = require("supertest");
const { app } = require("../src/app");
require("./resources/setup");
const en = require("../locale/en");
const {
  createUserConnection,
  addUser,
  userLogin,
} = require("./resources/frequent-functions");
const mockData = require("./resources/mock-data");

let cookie;
let token;

describe("Get by id", () => {
  const getUser = async (id) => {
    let agent = request(app)
      .get(`/api/1.0/users/${id}`)
      .set("Content-Type", "application/json");

    if (cookie && token) {
      agent.set("Cookie", cookie);
      agent.set("Authorization", `Bearer ${token}`);
    }

    return await agent.send();
  };

  it("returns - HTTP 429 when we try to get user without login", async () => {
    const users = await addUser(1);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    const response = await getUser(users[0].id);

    expect(response.status).toBe(429);
  });

  it(`returns - ${en.rate_limit_exceeded} when we try to get user without login`, async () => {
    const users = await addUser(1);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    await getUser(users[0].id);
    const response = await getUser(users[0].id);

    expect(response.body.message).toBe(en.rate_limit_exceeded);
  });

  it("returns - HTTP 401 when we try to get user without login", async () => {
    const user = await addUser();

    const response = await getUser(user[0].id);

    expect(response.status).toBe(401);
  });

  it(`returns - ${en.authentication_failure} when we try to get user  without login`, async () => {
    const users = await addUser();

    const response = await getUser(users[0].id);

    expect(response.body.message).toBe(en.authentication_failure);
  });

  it("returns - HTTP 200 ok when we get user  with authenticated request", async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    const response = await getUser(users[0].id);

    expect(response.status).toBe(200);
  });

  it("returns - user  data when we get user  with authenticated request", async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    const response = await getUser(users[0].id);

    expect(response.body.firstname).toBe(mockData.user1.firstname);
  });

  it("returns - HTTP 400  when we get user  with wrongly formatted id", async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    const response = await getUser("eiwnowin");

    expect(response.status).toBe(400);
  });

  it(`returns - ${en.userId_format} when we get user  with authenticated request`, async () => {
    const user = await addUser();
    await userLogin();
    const response = await getUser("ewoneo");

    expect(response.body.message).toBe(en.validation_failure);
    expect(response.body.validationErrors.id).toBe(en.userId_format);
  });
});

describe("Get all with pagination", () => {
  const getUsers = async (page = 1, limit = 10, filters = {}) => {
    let agent = request(app)
      .get("/api/1.0/users")
      .query({ page, limit, filters })
      .set("Content-Type", "application/json");

    if (cookie && token) {
      agent.set("Cookie", cookie);
      agent.set("Authorization", `Bearer ${token}`);
    }

    return await agent.send();
  };

  it("returns - HTTP 429 when we try to get user without login", async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    const response = await getUsers(users[0].id);

    expect(response.status).toBe(429);
  });

  it(`returns - ${en.rate_limit_exceeded} when we try to get user without login`, async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    await getUsers(users[0].id);
    const response = await getUsers(users[0].id);

    expect(response.body.message).toBe(en.rate_limit_exceeded);
  });

  it("returns - HTTP 401 when we try to get user connections without login", async () => {
    const users = await addUser(3);

    const response = await getUsers();

    expect(response.status).toBe(401);
  });

  it(`returns - ${en.authentication_failure} when we try to get user connections without login`, async () => {
    const users = await addUser(3);

    const response = await getUsers();

    expect(response.body.message).toBe(en.authentication_failure);
  });

  it("returns - HTTP 200 ok when we get users with authenticated request", async () => {
    const users = await addUser(3);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    const response = await getUsers();

    expect(response.status).toBe(200);
  });

  it("returns - user  data when we get users  with authenticated request", async () => {
    const users = await addUser(25);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    const response = await getUsers();

    expect(response.body.limit).toBe(10);
    expect(response.body.totalDocs).toBe(25);
  });

  it("returns - user connections of a particular using the filter", async () => {
    const users = await addUser(4);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    const response = await getUsers(1, 10, { firstname: "Joel" });

    expect(response.body.limit).toBe(10);
    expect(response.body.totalDocs).toBe(1);
  });
});
