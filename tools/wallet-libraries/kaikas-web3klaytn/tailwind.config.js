/**
 * @type {import("tailwindcss").Config}
 */
const config = {
  content: ["./**/*.js"],
  theme: {
    extend: {
      borderRadius: {
        kaikas: "15.4px",
      },
      colors: {
        bg: "#252525",
        kaikas: {
          primary: "#3366FF",
        },
        klaytn: {
          magma: "#ff3d00",
          orange: "#ff6700",
        },
      },
      minHeight: {
        kaikas: "44px",
      },
      minWidth: {
        kaikas: "280px",
      },
    },
  },
  plugins: [],
};
export default config;
