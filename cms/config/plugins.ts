import handleGameAnswer from "../src/socket/handleGameAnswer";
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
                {
                    name: 'game:answer',
                    handler: handleGameAnswer
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