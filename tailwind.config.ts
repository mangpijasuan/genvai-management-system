import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "#14243d", brand: "#2255a4", mist: "#f4f7fb" } } }, plugins: [] } satisfies Config;
