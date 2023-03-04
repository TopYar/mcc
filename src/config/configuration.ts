export default () => ({
    server: {
        port: process.env.PORT || 3000,
    },
    database: {
        postgres: process.env.POSTGRES_URL,
    },
});