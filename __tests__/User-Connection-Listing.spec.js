const request = require("supertest");
const { app } = require("../src/app");
require("./resources/setup");
const en = require("../locale/en");
const {
  createUserConnection,
  addUser,
  userLogin,
} = require("./resources/frequent-functions");

let cookie;
let token;

describe("Get by id", () => {
  const getuserConnection = async (id) => {
    let agent = request(app)
      .get(`/api/1.0/connections/${id}`)
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
    const userConnection = await createUserConnection(users[0].id, users[1].id);

    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    const response = await getuserConnection(userConnection.id);

    expect(response.status).toBe(429);
  });

  it(`returns - ${en.rate_limit_exceeded} when we try to get user without login`, async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;
    const userConnection = await createUserConnection(users[0].id, users[1].id);

    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    await getuserConnection(userConnection.id);
    const response = await getuserConnection(userConnection.id);

    expect(response.body.message).toBe(en.rate_limit_exceeded);
  });

  it("returns - HTTP 401 when we try to get user without login", async () => {
    const user = await addUser();

    const response = await getuserConnection(user[0].id);

    expect(response.status).toBe(401);
  });

  it(`returns - ${en.authentication_failure} when we try to get user connection without login`, async () => {
    const users = await addUser();

    const response = await getuserConnection(users[0].id);

    expect(response.body.message).toBe(en.authentication_failure);
  });

  it("returns - HTTP 200 ok when we get user connection with authenticated request", async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;
    const userConnection = await createUserConnection(users[0].id, users[1].id);
    const response = await getuserConnection(userConnection.id);

    expect(response.status).toBe(200);
  });

  it("returns - user connection data when we get user connection with authenticated request", async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;
    const userConnection = await createUserConnection(users[0].id, users[1].id);
    const response = await getuserConnection(userConnection.id);

    expect(response.body.users.length).toBe(2);
  });

  it("returns - HTTP 400  when we get user connection with wrongly formatted id", async () => {
    const user = await addUser();
    await userLogin();
    const response = await getuserConnection("foinewne");

    expect(response.status).toBe(400);
  });

  it(`returns - ${en.userId_format} when we get user connection with authenticated request`, async () => {
    const user = await addUser();
    await userLogin();
    const response = await getuserConnection("ewoneo");

    expect(response.body.message).toBe(en.validation_failure);
    expect(response.body.validationErrors.id).toBe(en.userId_format);
  });
});

describe("Get all with pagination", () => {
  const getuserConnections = async (page = 1, limit = 10, filters = {}) => {
    let agent = request(app)
      .get("/api/1.0/connections")
      .query({ page, limit })
      .set("Content-Type", "application/json");

    if (cookie && token) {
      agent.set("Cookie", cookie);
      agent.set("Authorization", `Bearer ${token}`);
    }

    if (filters != {}) {
      Object.entries(filters).forEach(([key, value]) => {
        let data = {};
        data[key] = value;
        agent.query(data);
      });
    }

    return await agent.send();
  };

  it("returns - HTTP 429 when we try to get user without login", async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;
    const userConnection = await createUserConnection(users[0].id, users[1].id);

    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    const response = await getuserConnections(userConnection.id);

    expect(response.status).toBe(429);
  });

  it(`returns - ${en.rate_limit_exceeded} when we try to get user without login`, async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;
    const userConnection = await createUserConnection(users[0].id, users[1].id);

    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    await getuserConnections(userConnection.id);
    const response = await getuserConnections(userConnection.id);

    expect(response.body.message).toBe(en.rate_limit_exceeded);
  });

  it("returns - HTTP 401 when we try to get user connections without login", async () => {
    const users = await addUser(3);

    await createUserConnection(users[0].id, users[1].id);
    await createUserConnection(users[0].id, users[2].id);
    await createUserConnection(users[1].id, users[2].id);

    const response = await getuserConnections();

    expect(response.status).toBe(401);
  });

  it(`returns - ${en.authentication_failure} when we try to get user connections without login`, async () => {
    const users = await addUser(3);

    await createUserConnection(users[0].id, users[1].id);
    await createUserConnection(users[0].id, users[2].id);
    await createUserConnection(users[1].id, users[2].id);

    const response = await getuserConnections();

    expect(response.body.message).toBe(en.authentication_failure);
  });

  it("returns - HTTP 200 ok when we get users with authenticated request", async () => {
    const users = await addUser(3);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    await createUserConnection(users[0].id, users[1].id);
    await createUserConnection(users[0].id, users[2].id);
    await createUserConnection(users[1].id, users[2].id);

    const response = await getuserConnections();

    expect(response.status).toBe(200);
  });

  it("returns - user connection data when we get users connection with authenticated request", async () => {
    const users = await addUser(3);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    await createUserConnection(users[0].id, users[1].id);
    await createUserConnection(users[0].id, users[2].id);
    await createUserConnection(users[1].id, users[2].id);

    const response = await getuserConnections(1, 2);

    expect(response.body.limit).toBe(2);
    expect(response.body.totalDocs).toBe(3);
  });

  it("returns - user connections of a particular using the filter", async () => {
    const users = await addUser(4);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    await createUserConnection(users[0].id, users[1].id);
    await createUserConnection(users[0].id, users[2].id);
    await createUserConnection(users[0].id, users[3].id);
    await createUserConnection(users[1].id, users[2].id);

    const response = await getuserConnections(1, 25, { users: users[0].id });

    expect(response.body.limit).toBe(25);
    expect(response.body.totalDocs).toBe(3);
  });
});
