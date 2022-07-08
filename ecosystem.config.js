
const Sunucu_1 = "Aztecas";
module.exports = {
    apps: [
        {
            name: `${Sunucu_1}-EXECUTIVE`,
            script: "./Exev2/main.js",
            watch: false
        },
        {
            name: `${Sunucu_1}-STATS`,
            script: "./Stats/main.js",
            watch: false
        },
        {
            name: `${Sunucu_1}-MOD`,
            script: "./Moderasyon/main.js",
            watch: false
        }
    ]
};
