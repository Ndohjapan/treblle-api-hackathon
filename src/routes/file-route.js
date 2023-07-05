const catchAsync = require("../util/catch-async");
const { rateLimiter } = require("../middleware/rate-limiter");
const { methodAllowed, setContentType } = require("../middleware/res-header");
const { userAuth } = require("../middleware/protect");
const { FileService } = require("../service/file-service");

module.exports = async (app) => {
  const service = new FileService();

  app.use(setContentType);
  app.use(methodAllowed({ methodAllow: "POST" }));


  app.post(
    "/api/1.0/files",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    userAuth,
    catchAsync(async (req, res) => {
      const result = await service.UploadFile(req);
      res.send(result);
    })
  );
};
