import { type Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"
const withMT = require("@material-tailwind/html/utils/withMT");


export default {
  content: [
    "./node_modules/flowbite-react/lib/**/*.js",
    "./src/**/*.{ts,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
} satisfies Config
