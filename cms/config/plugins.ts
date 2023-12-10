export default ({ env }) => ({
    io: {
        enabled: true,
        config: {
            contentTypes: ['api::result.result'],
            events: [
                {
                    name: 'connection',
                    handler({ strapi, io }, socket) {
                        // will log whenever a socket connects
                        strapi.log.info(`[io] new connection with id ${socket.id}`);
                    },
                },
            ],
            socket: {
                serverOptions: {
                    cors: { origin: '*' }
                }
            }
        }
    }
})