import { jwtDecode } from "jwt-decode";
import getUserResult from "../utils/getUserResult";
import getUserContest from "../utils/getUserContest";
import getUserGameState from "../utils/getUserGameState";
import getContestGroup from "../utils/getContestGroup";
import getContestGroups from "../utils/getContestGroups";

interface decodedToken {
    id: number,
    iat: number,
    exp: number
}

async function handleSocketConnection({ strapi, io }, socket) {
    try {
        const { token } = socket.handshake.auth
        const decoded = jwtDecode<decodedToken>(token)
        const { id: userID } = decoded

        const userContest = await getUserContest(userID)
        const userGameState = await getUserGameState(userID)
        const userResult = await getUserResult(userID)

        socket.emit('game:updateContest', userContest)
        socket.emit('game:updateGameState', userGameState)
        socket.emit('game:updateResult', userResult)

        // userGameState.currentTimeLeft++
        const contestGroups = await getContestGroups()
        const testGroup = await getContestGroup(3)
        for (const i in contestGroups) {
            const contestGroup = contestGroups[i]
            if (contestGroup.id === testGroup.id) {
                contestGroup.state.currentTimeLeft++
            }
        }
        const update = await strapi.entityService.update('api::contest-setting.contest-setting', 1, {
            data: { contestGroups }
        })
        console.log(update)

    } catch (err) {
        console.log(err)
    }
}

export default handleSocketConnection