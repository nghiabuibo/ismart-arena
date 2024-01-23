import { jwtDecode } from "jwt-decode";
import getUserResult from "../utils/getUserResult";
import getUserContest from "../utils/getUserContest";
import getUserGameState from "../utils/getUserGameState";
import getUserLeaderboard from "../utils/getUserLeaderboard";

interface decodedToken {
    id: number,
    iat: number,
    exp: number
}

async function handleUserConnection({ strapi, io }, socket, isSyncedGameData) {
    try {
        const { token } = socket.handshake.auth
        const decoded = jwtDecode<decodedToken>(token)
        const { id: userID } = decoded

        const userContest = await getUserContest(userID)
        const userGameState = await getUserGameState(userID)
        const userResult = await getUserResult(userID)
        const leaderboard = await getUserLeaderboard(userID)

        const gamePacks = userContest ? userContest.gamePacks : []

        socket.emit('game:updateGamePacks', gamePacks)
        socket.emit('game:updateGameState', userGameState)
        socket.emit('game:updateResult', userResult)
        socket.emit('game:updateLeaderboard', leaderboard)

        if (isSyncedGameData) return
        
        // broadcast newly joined user to update leaderboard
        socket.broadcast.emit('game:userJoined')
    } catch (err) {
        console.log(err)
    }
}

export default handleUserConnection