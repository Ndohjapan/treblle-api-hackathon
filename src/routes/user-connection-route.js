const {
  validateCreateUserConnectionInput,
  validateUserConnectionId,
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
      let { page, limit, ...filters } = req.query;
      page = page ? page : 1;
      limit = limit ? limit : 10;
      let data = filters.filters ? filters.filters : {};
      const userConnections = await service.FilterUserConnections({page, limit, data});
      res.send(userConnections);
    })
  );

  app.get(
    "/api/1.0/connections/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    validateUserConnectionId,
    userAuth,
    catchAsync(async (req, res) => {
      const id = req.params.id;
      const userConnection = await service.FindById(id);
      res.send(userConnection);
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
