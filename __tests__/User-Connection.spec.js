const request = require("supertest");
const { app } = require("../src/app");
require("./resources/setup");
const en = require("../locale/en");
const { addUser, userLogin } = require("./resources/frequent-functions");

let cookie;
let token;

const createUserConnection = async (data) => {
  let agent = request(app).post("/api/1.0/connections");

  if (cookie && token) {
    agent.set("Cookie", cookie);
    agent.set("Authorization", `Bearer ${token}`);
  }

  return await agent.send(data);
};

describe("Create User Connection", () => {
  it("return - HTTP 401 when we try to create connection without login", async () => {
    const users = await addUser(2);

    const response = await createUserConnection({ userId: users[1].id });

    expect(response.status).toBe(401);
  });

  it(`return - ${en.authentication_failure} when we try to create connection without login`, async () => {
    const users = await addUser(2);

    const response = await createUserConnection({ userId: users[1].id });

    expect(response.body.message).toBe(en.authentication_failure);
  });

  it(`return - HTTP 429 and "${en.rate_limit_exceeded}" when user connection is created successfully`, async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    await createUserConnection({ userId: users[1].id });
    await createUserConnection({ userId: users[1].id });
    await createUserConnection({ userId: users[1].id });
    await createUserConnection({ userId: users[1].id });
    await createUserConnection({ userId: users[1].id });
    await createUserConnection({ userId: users[1].id });
    await createUserConnection({ userId: users[1].id });
    await createUserConnection({ userId: users[1].id });
    await createUserConnection({ userId: users[1].id });
    await createUserConnection({ userId: users[1].id });
    await createUserConnection({ userId: users[1].id });
    await createUserConnection({ userId: users[1].id });
    const response = await createUserConnection({ userId: users[1].id });

    expect(response.status).toBe(429);
    expect(response.body.message).toBe(en.rate_limit_exceeded);
  });

  it.each`
    userId                   | message
    ${null}                  | ${en.userId_null}
    ${""}                    | ${en.userId_null}
    ${[123, 12]}             | ${en.userId_format}
    ${["fewun", "wuinewfe"]} | ${en.userId_format}
    ${{ hello: "world" }}    | ${en.userId_format}
  `(
    "returns - HTTP 400  and '$message' when userId is wrongly formatted to '$userId'",
    async ({ userId, message }) => {
      await addUser(2);
      let auth = await userLogin();
      cookie = auth.cookie;
      token = auth.token;

      const response = await createUserConnection({ userId });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(en.validation_failure);
      expect(response.body.validationErrors.userId).toBe(message);
    }
  );

  it("return - HTTP 200 ok when user connection is created successfully", async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    const response = await createUserConnection({ userId: users[1].id });

    expect(response.status).toBe(200);
  });

  it("return - user connection data when user connection is created successfully", async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    const response = await createUserConnection({ userId: users[1].id });

    expect(response.body.users.length).toBe(2);
    expect(response.body.users.includes(users[0].id)).toBeTruthy();
    expect(response.body.users.includes(users[1].id)).toBeTruthy();
  });

  it("return - HTTP 409 when we try to create connection between already connected users", async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    await createUserConnection({ userId: users[1].id });
    
    const response = await createUserConnection({ userId: users[1].id });
    
    expect(response.status).toBe(409);

  });

  it(`return - ${en.user_connection_already_exists} when we try to create connection between already connected users`, async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    await createUserConnection({ userId: users[1].id });
    
    const response = await createUserConnection({ userId: users[1].id });
    
    expect(response.body.message).toBe(en.user_connection_already_exists);

  });

  it(`return - ${en.user_connection_already_exists} when we try to create connection between already connected users`, async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;
    
    await createUserConnection({ userId: users[1].id });
    
    auth = await userLogin({username: "Ndohjapan1", password: "P4ssword@"});
    cookie = auth.cookie;
    token = auth.token;

    const response = await createUserConnection({ userId: users[0].id });
    
    expect(response.body.message).toBe(en.user_connection_already_exists);

  });

  it("return - HTTP 400 when we try to create connection with 2 same user ids", async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    const response = await createUserConnection({ userId: users[0].id });
        
    expect(response.status).toBe(400);

  });

  it(`return - ${en.user_connection_already_exists} when we try to create connection with 2 same user ids`, async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    const response = await createUserConnection({ userId: users[0].id });
        
    expect(response.body.message).toBe(en.user_connection_error_same_ids);

  });
});
