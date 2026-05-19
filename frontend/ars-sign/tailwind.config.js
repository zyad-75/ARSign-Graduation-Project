/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
        "./node_modules/flowbite/**/*.js"
    ],
    theme: {
        extend: {
            colors: {
                primary: '#FFD700', // Gold/Yellow
                secondary: '#003366', // Dark Blue
            }
        },
    },
    plugins: [
        require('flowbite/plugin')
    ],
}
