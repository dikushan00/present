const nextConfig = {
  env: {
    API_URL: process.env.NODE_ENV === "development" ? "http://localhost:5000/" : "https://gsl-arena.herokuapp.com/"
  },
};

module.exports = nextConfig;
