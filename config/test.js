module.exports = {
  database: {
    URL: `mongodb://127.0.0.1:27017/test_${new Date().getTime()}`,
  },

  session: {
    secret: "ji291812m92hwe2QAA2@ew!jewufiw0+302-jfjD$!@1d",
  },

  redis: {
    URL: "127.0.0.1:6380",
  },
};
