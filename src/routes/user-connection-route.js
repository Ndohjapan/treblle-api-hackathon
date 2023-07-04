const {
  validateCreateUserConnectionInput,
} = require("../middleware/user-connection-validation");
const catchAsync = require("../util/catch-async");
const { rateLimiter } = require("../middleware/rate-limiter");
const {
  methodAllowed,
  contentTypeHeader,
  setContentType,
} = require("../middleware/res-header");
const { UserConnectionService } = require("../service/user-connection-service");
const { userAuth } = require("../middleware/protect");

module.exports = async (app) => {
  const service = new UserConnectionService();

  app.use(methodAllowed({ methodAllow: "GET" }));
  app.use(setContentType);
  app.use(contentTypeHeader);

  app.get(
    "/api/1.0/connections",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    userAuth,
    catchAsync(async (req, res) => {
      let { page, limit } = req.query;
      page = page ? page : 1;
      limit = limit ? limit : 10;
      const userConnections = await service.FindAll({ page, limit });
      res.send(userConnections);
    })
  );

  app.use(methodAllowed({ methodAllow: "POST" }));

  app.post(
    "/api/1.0/connections",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    validateCreateUserConnectionInput,
    userAuth,
    catchAsync(async (req, res) => {
      const { userId } = req.body;
      const myId = req.user.id;

      const userConnection = await service.createUserConnection(myId, userId);
      res.send(userConnection);
    })
  );
};
