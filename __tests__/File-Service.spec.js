const request = require("supertest");
const { app } = require("../src/app");
require("./resources/setup");
const fs = require("fs");
const path = require("path");
const en = require("../locale/en");
const {
    createUserConnection,
    addUser,
    userLogin,
} = require("./resources/frequent-functions");

let cookie;
let token;

describe("Upload files", () => {
    const uploadFile = async(connectionId, file = "test-jpg.jpg") => {
        // eslint-disable-next-line no-undef
        const filePath = path.resolve(__dirname, "resources", file);
        return await request(app)
            .post("/api/1.0/files")
            .set("Cookie", cookie)
            .set("Authorization", `Bearer ${token}`)
            .attach("file", filePath)
            .field("connectionId", connectionId);
    };

    it("return - HTTP 200 ok when we uplaod a correct file", async() => {
        const users = await addUser(2);
        const userConnection = await createUserConnection(users[0].id, users[1].id);

        let auth = await userLogin();
        cookie = auth.cookie;
        token = auth.token;

        const response = await uploadFile(userConnection.id);

        expect(response.status).toBe(200);
    });

    it("return - HTTP 400 ok when we uplaod a file with wrong connectionid", async() => {
        const users = await addUser(2);
        await createUserConnection(users[0].id, users[1].id);

        let auth = await userLogin();
        cookie = auth.cookie;
        token = auth.token;

        const response = await uploadFile("329h9329n39n323");

        expect(response.status).toBe(400);
    });

    it(`return - ${en.id_format} ok when we uplaod a file with wrong connectionid`, async() => {
        const users = await addUser(2);
        await createUserConnection(users[0].id, users[1].id);

        let auth = await userLogin();
        cookie = auth.cookie;
        token = auth.token;

        const response = await uploadFile("329h9329n39n323");

        expect(response.body.validationErrors.file).toBe(en.userId_format);
    });

    it(`return - ${en.file_to_wrong_connection} when we uplaod a file with to a non-existent user connection document`, async() => {
        const users = await addUser(3);
        await createUserConnection(users[0].id, users[1].id);
        await createUserConnection(users[1].id, users[2].id);

        let auth = await userLogin();
        cookie = auth.cookie;
        token = auth.token;

        const response = await uploadFile(users[0].id);

        expect(response.status).toBe(400);
        expect(response.body.validationErrors.file).toBe(
            en.user_connection_find_error
        );
    });

    it(`return - ${en.file_to_wrong_connection} when we uplaod a file with to a connection that is not yours`, async() => {
        const users = await addUser(3);
        await createUserConnection(users[0].id, users[1].id);
        const userConnection = await createUserConnection(users[1].id, users[2].id);

        let auth = await userLogin();
        cookie = auth.cookie;
        token = auth.token;

        const response = await uploadFile(userConnection.id);

        expect(response.status).toBe(400);
        expect(response.body.validationErrors.file).toBe(
            en.file_to_wrong_connection
        );
    });

    it("return - HTTP 400 when we upload a wrong file that is not video and image", async() => {
        const users = await addUser(2);
        const userConnection = await createUserConnection(users[0].id, users[1].id);

        let auth = await userLogin();
        cookie = auth.cookie;
        token = auth.token;

        const response = await uploadFile(userConnection.id, "test-pdf.pdf");

        expect(response.status).toBe(400);
    });

    it(`return - ${en.file_not_supported} when we upload a wrong file that is not video and image`, async() => {
        const users = await addUser(2);
        const userConnection = await createUserConnection(users[0].id, users[1].id);

        let auth = await userLogin();
        cookie = auth.cookie;
        token = auth.token;

        const response = await uploadFile(userConnection.id, "test-pdf.pdf");

        expect(response.body.validationErrors.file).toBe(en.file_not_supported);
    });

    it("return - HTTP and error message when we upload a file larger than 5mb", async() => {
        const users = await addUser(2);
        const userConnection = await createUserConnection(users[0].id, users[1].id);

        let auth = await userLogin();
        cookie = auth.cookie;
        token = auth.token;

        const fiveMB = 5 * 1024 * 1024;
        // eslint-disable-next-line no-undef
        const filePath = path.join(__dirname, "resources", "random-file");
        fs.writeFileSync(filePath, "a".repeat(fiveMB) + "a");

        const response = await uploadFile(userConnection.id, "random-file");

        expect(response.status).toBe(400);
        expect(response.body.validationErrors.file.startsWith("options.maxFileSize")).toBeTruthy();
    });

    it("return - HTTP and error message when we upload a file with more than one field", async() => {
        const users = await addUser(2);
        const userConnection = await createUserConnection(users[0].id, users[1].id);

        let auth = await userLogin();
        cookie = auth.cookie;
        token = auth.token;

        // eslint-disable-next-line no-undef
        const filePath = path.resolve(__dirname, "resources", "test-png.png");
        const response = await request(app)
            .post("/api/1.0/files")
            .set("Cookie", cookie)
            .set("Authorization", `Bearer ${token}`)
            .attach("file", filePath)
            .field("connectionId", userConnection.id)
            .field("field2", userConnection.id);

        expect(response.status).toBe(400);
        expect(response.body.validationErrors.file.startsWith("options.maxFields")).toBeTruthy();
    });

    it("return - only the url to the file when we upload a correct file", async() => {
        const users = await addUser(2);
        const userConnection = await createUserConnection(users[0].id, users[1].id);

        let auth = await userLogin();
        cookie = auth.cookie;
        token = auth.token;

        const response = await uploadFile(userConnection.id);

        expect(response.body.url).toBeTruthy();
        expect(response.body.url).toMatch(/^https?:\/\/\S+$/);
    });
});