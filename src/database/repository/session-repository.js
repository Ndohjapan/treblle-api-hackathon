const en = require("../../../locale/en");
const internalException = require("../../error/internal-exception");
const { Session } = require("../model");

class SessionRepository {
    async DeleteOne(data) {
        try {
            const sessions = await Session.deleteMany(data);
            return sessions;
        } catch (error) {
            throw new internalException(en.message_delete_error);
        }
    }
}

module.exports = SessionRepository;