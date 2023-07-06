const UserConnectionRepository = require("../database/repository/user-connection-repository");
const en = require("../../locale/en");
const NotFoundException = require("../error/not-found-exception");
const CreationException = require("../error/creation-exception");
const UserRepository = require("../database/repository/user-repository");

class UserConnectionService {
    constructor() {
        this.repository = new UserConnectionRepository();
        this.userRepository = new UserRepository();
    }

    async createUserConnection(myId, otherUserId) {
        try {
            if (myId === otherUserId) {
                throw new CreationException(en.user_connection_error_same_ids, 400);
            }

            const otherUserIdExists = await this.userRepository.FindUserById(
                otherUserId
            );

            if (!otherUserIdExists.id) {
                throw new CreationException(en.user_server_error, 400);
            }

            const connectionExists = await this.repository.FilterUserConnections({
                page: 1,
                limit: 100,
                data: { users: { $all: [myId, otherUserId] } },
            });

            if (!connectionExists.totalDocs) {
                const userConnection = await this.repository.CreateUserConnection({
                    users: [myId, otherUserId],
                });
                return userConnection;
            }

            throw new CreationException(en.user_connection_already_exists, 409);
        } catch (error) {
            if (error.status === 409) {
                throw new CreationException(en.user_connection_already_exists, 409);
            }

            if (error.status === 400) {
                throw new CreationException(error.message, 400);
            }

            throw new CreationException(en.user_connection_creation_error, 401);
        }
    }

    async FindById(id) {
        try {
            const userConnection = await this.repository.FindUserConnectionById(id);

            return userConnection;
        } catch (error) {
            throw new NotFoundException(en.user_connection_not_found);
        }
    }

    async UpdateOne(id, data) {
        let updateData = {};

        data.users = "";

        Object.entries(data).forEach(([key, value]) => {
            if (value != "") {
                updateData[key] = value;
            }
        });

        try {
            const user = await this.repository.UpdateOne({ id, updateData });

            return user;
        } catch (error) {
            throw new NotFoundException(en.user_not_found);
        }
    }

    async FilterUserConnections({ page, limit, data }) {
        let updateData = {};

        Object.entries(data).forEach(([key, value]) => {
            if (value != "") {
                updateData[key] = value;
            }
        });

        try {
            const users = await this.repository.FilterUserConnections({
                page,
                limit,
                data: updateData,
            });
            return users;
        } catch (error) {
            throw new NotFoundException(en.user_connection_not_found);
        }
    }
}

module.exports = { UserConnectionService };