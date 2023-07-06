const request = require("supertest");
const { app } = require("../src/app");
require("./resources/setup");
const en = require("../locale/en");
const {
  addUser,
  userLogin,
  createUserConnection,
} = require("./resources/frequent-functions");
const { UserConnection } = require("../src/database/model");
const messageData = {
  text: "How are you doing 😀",
  images: [
    "https://res.cloudinary.com/lcu-feeding/image/upload/v1688562729/messages/64a466614a89ecb408e09a65/fxfsrentebra3rgi3x5l.jpg",
  ],
  videos: [
    "https://res.cloudinary.com/lcu-feeding/video/upload/v1688562759/messages/64a466614a89ecb408e09a65/legla8g4uffmixixkcjw.mp4",
  ],
};

let cookie;
let token;

const createMessage = async (connectionId, message = messageData) => {
  let data = { ...message, connectionId };
  let agent = request(app).post("/api/1.0/messages");

  if (cookie && token) {
    agent.set("Cookie", cookie);
    agent.set("Authorization", `Bearer ${token}`);
  }

  return await agent.send(data);
};

describe("Create a Message", () => {
  it("return - HTTP 401 when we try to create a message without login", async () => {
    const users = await addUser(2);

    const userConnection = await createUserConnection(users[0].id, users[1].id);

    const response = await createMessage(userConnection.id);

    expect(response.status).toBe(401);
  });

  it(`return - ${en.authentication_failure} when we try to create message without login`, async () => {
    const users = await addUser(2);

    const userConnection = await createUserConnection(users[0].id, users[1].id);

    const response = await createMessage(userConnection.id);

    expect(response.body.message).toBe(en.authentication_failure);
  });

  it(`return - HTTP 429 and "${en.rate_limit_exceeded}"  when message is created successfully`, async () => {
    const users = await addUser(2);

    const userConnection = await createUserConnection(users[0].id, users[1].id);

    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    await createMessage(userConnection.id);
    await createMessage(userConnection.id);
    await createMessage(userConnection.id);
    await createMessage(userConnection.id);
    await createMessage(userConnection.id);
    await createMessage(userConnection.id);
    await createMessage(userConnection.id);
    await createMessage(userConnection.id);
    await createMessage(userConnection.id);
    await createMessage(userConnection.id);
    await createMessage(userConnection.id);
    await createMessage(userConnection.id);
    await createMessage(userConnection.id);
    await createMessage(userConnection.id);
    await createMessage(userConnection.id);
    const response = await createMessage(userConnection.id);

    expect(response.status).toBe(429);
    expect(response.body.message).toBe(en.rate_limit_exceeded);
  });

  it.each`
    connectionId             | message
    ${null}                  | ${en.id_null}
    ${""}                    | ${en.id_null}
    ${123456767}             | ${en.id_format}
    ${[123, 12]}             | ${en.userId_format}
    ${["fewun", "wuinewfe"]} | ${en.userId_format}
    ${{ hello: "world" }}    | ${en.userId_format}
  `(
    "returns - HTTP 400 and '$message' when connectionId is wrongly formatted to '$connectionId'",
    async ({ connectionId, message }) => {
      const users = await addUser(2);

      await createUserConnection(users[0].id, users[1].id);

      let auth = await userLogin();
      cookie = auth.cookie;
      token = auth.token;

      const response = await createMessage(connectionId);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(en.validation_failure);
      expect(response.body.validationErrors.connectionId).toBe(message);
    }
  );

  it("return - 200 ok when message is created successfully", async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    const userConnection = await createUserConnection(users[0].id, users[1].id);

    const response = await createMessage(userConnection.id);

    expect(response.status).toBe(200);
  });

  it("return - messsage data when message is created successfully", async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    const userConnection = await createUserConnection(users[0].id, users[1].id);

    const response = await createMessage(userConnection.id);

    expect(response.body.text).toBe(messageData.text);
  });

  it("check - ensure the last message of the user connection is updated", async () => {
    const users = await addUser(2);
    let auth = await userLogin();
    cookie = auth.cookie;
    token = auth.token;

    const userConnection = await createUserConnection(users[0].id, users[1].id);

    const response = await createMessage(userConnection.id);

    const connectiondb = await UserConnection.findById(userConnection.id);

    expect(connectiondb.lastMessage.toString()).toBe(response.body._id);
  });
});
