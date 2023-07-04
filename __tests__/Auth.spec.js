const request = require("supertest");
const { app } = require("../src/app");
const {
  connectToDatabase,
  mongoose,
  redis,
} = require("../src/database/connection");
const { User, Session } = require("../src/database/model");
const en = require("../locale/en");
const credentials = { username: "Ndohjapan", password: "P4ssword@" };
const mockData = require("./resources/mock-data");

let cookie;

beforeEach(async () => {
  await connectToDatabase();
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await redis.flushdb();
});

const addUser = async (user = mockData.user1) => {
  const data = await User.create(user);
  return data;
};

const userSignup = async (
  user = { ...mockData.user1, password: "P4ssword@" }
) => {
  let agent = await request(app).post("/api/1.0/signup").send(user);

  return agent;
};

const userLogin = async (user = credentials) => {
  let agent = await request(app).post("/api/1.0/login").send(user);

  cookie = agent.headers["set-cookie"];
  return agent;
};

const userLogout = async () => {
  let agent = await request(app)
    .post("/api/1.0/logout")
    .set("Cookie", cookie)
    .send();

  return agent;
};

describe("User Signup", () => {
  it("returns - HTTP 429 when we exceed rate limit", async () => {
    await userSignup();
    await userSignup();
    await userSignup();
    await userSignup();
    await userSignup();
    await userSignup();
    await userSignup();
    await userSignup();
    await userSignup();
    await userSignup();
    const response = await userSignup();

    expect(response.status).toBe(429);
  });

  it(`returns - ${en.rate_limit_exceeded} when we exceed rate limit`, async () => {
    await userSignup();
    await userSignup();
    await userSignup();
    await userSignup();
    await userSignup();
    await userSignup();
    await userSignup();
    await userSignup();
    await userSignup();
    await userSignup();
    const response = await userSignup();

    expect(response.body.message).toBe(en.rate_limit_exceeded);
  });

  it.each`
    firstname                | message
    ${null}                  | ${en.firstname_null}
    ${""}                    | ${en.firstname_null}
    ${[123, 12]}             | ${en.firstname_format}
    ${["fewun", "wuinewfe"]} | ${en.firstname_format}
    ${{ hello: "world" }}    | ${en.firstname_format}
  `(
    "returns - \"$message\" when firstname is wrongly formatted to \"$firstname\" ",
    async ({ firstname, message }) => {
      const response = await userSignup({ ...credentials, firstname });

      expect(response.status).toBe(400);
      expect(response.body.validationErrors.firstname).toBe(message);
    }
  );

  it.each`
    lastname                 | message
    ${null}                  | ${en.lastname_null}
    ${""}                    | ${en.lastname_null}
    ${[123, 12]}             | ${en.lastname_format}
    ${["fewun", "wuinewfe"]} | ${en.lastname_format}
    ${{ hello: "world" }}    | ${en.lastname_format}
  `(
    "returns - \"$message\" when lastname is wrongly formatted to \"$lastname\" ",
    async ({ lastname, message }) => {
      const response = await userSignup({ ...credentials, lastname });

      expect(response.status).toBe(400);
      expect(response.body.validationErrors.lastname).toBe(message);
    }
  );

  it.each`
    username                 | message
    ${null}                  | ${en.username_null}
    ${""}                    | ${en.username_null}
    ${[123, 12]}             | ${en.username_format}
    ${["fewun", "wuinewfe"]} | ${en.username_format}
    ${{ hello: "world" }}    | ${en.username_format}
  `(
    "returns - \"$message\" when username is wrongly formatted to \"$username\" ",
    async ({ username, message }) => {
      const response = await userSignup({ ...credentials, username });

      expect(response.status).toBe(400);
      expect(response.body.validationErrors.username).toBe(message);
    }
  );

  it.each`
    password                 | message
    ${12345}                 | ${en.password_format}
    ${[123, 12]}             | ${en.password_format}
    ${["fewun", "wuinewfe"]} | ${en.password_format}
    ${{ hello: "world" }}    | ${en.password_format}
    ${"ewjinew"}             | ${en.password_length}
    ${"password"}            | ${en.password_requirement}
    ${"Password"}            | ${en.password_requirement}
    ${"P4ssword"}            | ${en.password_requirement}
  `(
    "returns - \"$message\" when password is wrongly formatted to \"$password\" ",
    async ({ password, message }) => {
      const response = await userSignup({ ...credentials, password });

      expect(response.status).toBe(400);
      expect(response.body.validationErrors.password).toBe(message);
    }
  );

  it("return - HTTP 200 ok when signup is successful", async() => {
    const response = await userSignup();

    expect(response.status).toBe(200);
  });

  it(`return - ${en.signup_successful} ok when signup is successful`, async() => {
    const response = await userSignup();

    expect(response.body.message).toBe(en.signup_successful);
  });

  it("return - HTTP 409 when we try to signup with same username", async() => {
    await userSignup();
    const response = await userSignup();

    expect(response.status).toBe(409);
  });

  it(`return - ${en.username_exists} ok when signup is successful`, async() => {
    await userSignup();
    const response = await userSignup();

    expect(response.body.message).toBe(en.username_exists);
  });
});

describe("User Login", () => {
  it("returns - HTTP 429 when we exceed rate limit", async () => {
    await userLogin();
    await userLogin();
    await userLogin();
    await userLogin();
    await userLogin();
    await userLogin();
    await userLogin();
    await userLogin();
    await userLogin();
    await userLogin();
    const response = await userLogin();

    expect(response.status).toBe(429);
  });

  it(`returns - ${en.rate_limit_exceeded} when we exceed rate limit`, async () => {
    await userLogin();
    await userLogin();
    await userLogin();
    await userLogin();
    await userLogin();
    await userLogin();
    await userLogin();
    await userLogin();
    await userLogin();
    await userLogin();
    const response = await userLogin();

    expect(response.body.message).toBe(en.rate_limit_exceeded);
  });

  it("returns - HTTP 400 when we try to pass an empty password", async () => {
    await addUser();
    const response = await userLogin({ ...credentials, password: "" });

    expect(response.status).toBe(400);
  });

  it(`returns - ${en.password_null} when we try to pass an empty password`, async () => {
    await addUser();
    const response = await userLogin({ ...credentials, password: "" });

    expect(response.body.validationErrors.password).toBe(en.password_null);
  });

  it("returns - HTTP 400 when we try to pass a number formatted password", async () => {
    await addUser();
    const response = await userLogin({ ...credentials, password: 1234345 });

    expect(response.status).toBe(400);
  });

  it.each`
    password                 | message
    ${12345}                 | ${en.password_format}
    ${[123, 12]}             | ${en.password_format}
    ${["fewun", "wuinewfe"]} | ${en.password_format}
    ${{ hello: "world" }}    | ${en.password_format}
  `(
    "returns - \"$message\" when password is wrongly formatted to \"$password\" ",
    async ({ password, message }) => {
      await addUser();
      const response = await userLogin({ ...credentials, password });

      expect(response.body.validationErrors.password).toBe(message);
    }
  );

  it("returns - HTTP 400 when we try to pass an empty username", async () => {
    await addUser();
    const response = await userLogin({ ...credentials, username: "" });

    expect(response.status).toBe(400);
  });

  it(`returns - ${en.username_null} when we try to pass an empty username`, async () => {
    await addUser();
    const response = await userLogin({ ...credentials, username: "" });

    expect(response.body.validationErrors.username).toBe(en.username_null);
  });

  it("returns - HTTP 400 when we try to pass a number formatted", async () => {
    await addUser();
    const response = await userLogin({ ...credentials, username: "" });

    expect(response.status).toBe(400);
  });

  it.each`
    username                 | message
    ${12345}                 | ${en.username_format}
    ${[123, 12]}             | ${en.username_format}
    ${["fewun", "wuinewfe"]} | ${en.username_format}
    ${{ hello: "world" }}    | ${en.username_format}
  `(
    "returns - \"$message\" when username is wrongly formatted to \"$username\" ",
    async ({ username, message }) => {
      await addUser();
      const response = await userLogin({ ...credentials, username });

      expect(response.body.validationErrors.username).toBe(message);
    }
  );

  it("return - HTTP 401 when we login with invalid password", async () => {
    await addUser();
    const response = await userLogin({ username: "joel", password: "12343" });

    expect(response.status).toBe(401);
  });

  it(`return - ${en.login_failure} when we login with invalid password`, async () => {
    await addUser();
    const response = await userLogin({ username: "joel", password: "12343" });

    expect(response.body.message).toBe(en.login_failure);
  });

  it("returns - proper error body when authentication fails", async () => {
    await addUser();
    const nowInMillis = new Date().getTime();
    const response = await userLogin({ ...credentials, username: "wrong" });
    const error = response.body;
    expect(error.path).toBe("/api/1.0/login");
    expect(error.timestamp).toBeGreaterThan(nowInMillis);
    expect(Object.keys(error)).toEqual(["path", "timestamp", "message"]);
  });

  it("return - HTTP 200 OK when the login is successful ", async () => {
    await addUser();
    const response = await userLogin();

    expect(response.status).toBe(200);
  });

  it("returns - user data when the login is successful", async () => {
    await addUser();
    const response = await userLogin();

    expect(response.body.firstname).toBe(mockData.user1.firstname);
  });

  it("check - ensure no password, createdAt and updatedAt is returned on successful login", async () => {
    await addUser();
    const response = await userLogin();

    expect(response.body.password).toBeFalsy();
    expect(response.body.createdAt).toBeFalsy();
    expect(response.body.updatedAt).toBeFalsy();
  });

  it("check - the session collection to see if the user session is registered", async () => {
    const user = await addUser();
    await userLogin();

    const sessions = await Session.find({});
    const sessionUserId = JSON.parse(sessions[0].session).passport.user;

    expect(sessions.length).toBe(1);
    expect(sessionUserId).toBe(user.id);
  });
});

describe("User Logout", () => {
  it("return - HTTP 200 ok after logout", async () => {
    await addUser();
    await userLogin();

    const response = await userLogout();

    expect(response.status).toBe(204);
  });

  it("check - the session collection to see if the user session is deleted", async () => {
    await addUser();
    await userLogin();

    const sessionsBefore = await Session.find({});
    const sessionUserIdBefore = JSON.parse(sessionsBefore[0].session).passport
      .user;

    await userLogout();
    const sessions = await Session.find({});
    const sessionUserId = JSON.parse(sessions[0].session).passport;

    expect(sessionsBefore.length).toBe(1);
    expect(sessions.length).toBe(1);
    expect(sessionUserIdBefore).toBeTruthy();
    expect(sessionUserId).toBeFalsy();
  });
});
