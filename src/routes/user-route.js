const {
  validateUserId,
} = require("../middleware/input-validations/user-input-validation");
const catchAsync = require("../util/catch-async");
const { rateLimiter } = require("../middleware/rate-limiter");
const {
  methodAllowed,
  setContentType,
} = require("../middleware/res-header");
const { UserService } = require("../service/user-service");
const { userAuth } = require("../middleware/protect");

module.exports = async (app) => {
  const service = new UserService();

  app.use(methodAllowed({ methodAllow: "GET" }));
  app.use(setContentType);

  app.get(
    "/api/1.0/users",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    userAuth,
    catchAsync(async (req, res) => {
      let { page, limit, ...filters } = req.query;
      page = page ? page : 1;
      limit = limit ? limit : 10;
      let data = filters;
      const user = await service.FilterUsers({
        page,
        limit,
        data,
      });
      res.send(user);
    })
  );

  app.get(
    "/api/1.0/users/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    validateUserId,
    userAuth,
    catchAsync(async (req, res) => {
      const id = req.params.id;
      const user = await service.FindById(id);
      res.send(user);
    })
  );

  app.use(methodAllowed({ methodAllow: "POST" }));

  app.patch(
    "/api/1.0/users/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    userAuth,
    catchAsync(async (req, res) => {
      let data = req.body;
      let id = req.params.id;
      const user = await service.UpdateOne(id, data);
      res.send(user);
    })
  );

};
