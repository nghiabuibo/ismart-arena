import handleSocketConnection from "../src/socket/handleSocketConnection";

export default ({ env }) => ({
    io: {
        enabled: true,
        config: {
            contentTypes: ['api::result.result'],
            events: [
                {
                    name: 'connection',
                    handler: handleSocketConnection
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