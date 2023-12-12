import { jwtDecode } from "jwt-decode";
import getUserResult from "../utils/getUserResult";

interface decodedToken {
    id: number,
    iat: number,
    exp: number
}

interface answer {
    timestamp: number,
    gamePackID: number,
    questionID: number,
    answer: number|string,
    score: number,
}

async function handleGameAnswer({ strapi, io }, socket, answer: answer) {
    try {
        const { token } = socket.handshake.auth
        const decoded = jwtDecode<decodedToken>(token)
        const { id: userID } = decoded

        // get user current game state
        // get user current contest
        // get user current result
        // add new answer to result answers
        // score answers
        // update result answers and score
        const result = await getUserResult(userID)
        await strapi.entityService.update('api::result.result', result.id, {
            data: {
                answers: {answer: answer},
                totalScore: Math.round(Math.random() * 100)
            }
        })

    } catch (err) {
        console.log(err)
    }
}

export default handleGameAnswer