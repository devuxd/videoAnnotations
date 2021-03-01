module.exports = {
  async redirects() {
    return [
      {
        source: "/dataset/1IZgX6i/:slug*",
        destination: "/dataset/1IZgX6i_yiuq9U3oksIl5aCaLq2RZuu-aU0p4kzAhaNY", // Matched parameters can be used in the destination
        permanent: true,
      },
    ];
  },
};
