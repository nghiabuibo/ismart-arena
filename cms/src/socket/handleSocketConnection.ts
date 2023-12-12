import { jwtDecode } from "jwt-decode";
import getUserResult from "../utils/getUserResult";
import getUserContest from "../utils/getUserContest";
import getUserGameState from "../utils/getUserGameState";

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

        const gamePacks = userContest ? userContest.gamePacks : []

        socket.emit('game:initGamePacks', gamePacks)
        socket.emit('game:initGameState', userGameState)
        socket.emit('game:initResult', userResult)

    } catch (err) {
        console.log(err)
    }
}

export default handleSocketConnection