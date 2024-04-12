import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
