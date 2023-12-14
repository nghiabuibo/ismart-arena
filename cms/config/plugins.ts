import handleAdminGetContestGroups from "../src/socket/admin/handleAdminGetContestGroups";
import handleAdminUpdateContestGroups from "../src/socket/admin/handleAdminUpdateContestGroups";
import handleGameAnswer from "../src/socket/handleGameAnswer";
import handleGetGameState from "../src/socket/handleGetGameState";
import handleUserConnection from "../src/socket/handleUserConnection";

export default ({ env }) => ({
    io: {
        enabled: true,
        config: {
            contentTypes: ['api::result.result', 'api::contest-setting.contest-setting'],
            events: [
                {
                    name: 'admin:getContestGroups',
                    handler: handleAdminGetContestGroups
                },
                {
                    name: 'admin:updateContestGroups',
                    handler: handleAdminUpdateContestGroups
                },
                {
                    name: 'user:connection',
                    handler: handleUserConnection
                },
                {
                    name: 'game:answer',
                    handler: handleGameAnswer
                },
                {
                    name: 'game:getGameState',
                    handler: handleGetGameState
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