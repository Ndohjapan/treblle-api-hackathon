const en = require("../../locale/en");
const NotFoundException = require("../error/not-found-exception");
const SessionRepository = require("../database/repository/session-repository");
const ONE_WEEK_IN_MILLI = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

class SessionService {
  constructor() {
    this.repository = new SessionRepository();
  }

  async scheduleSessionDelete() {
    try {
      const data = {
        $expr: {
          $gt: [{
            $toDate: {
              $getJSONSchema: {
                $concat: [
                  "{\"$dateFromString\": { \"dateString\": \"",
                  { $substrCP: ["$session", 92, 24] },
                  "\" } }",
                ],
              },
            },
          },
          ONE_WEEK_IN_MILLI,
          ],
        },
      };
      setInterval(async() => {
        await this.repository.DeleteOne(data);
      }, 60 * 60 * 1000);
    } catch (error) {
      throw new NotFoundException(error.message || en.message_delete_error);
    }
  }
}

module.exports = { SessionService };