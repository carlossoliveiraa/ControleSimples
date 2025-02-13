/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'whatsapp': {
                    DEFAULT: '#00a884',
                    dark: '#008f6f',
                }
            }
        },
    },
    plugins: [],
} 