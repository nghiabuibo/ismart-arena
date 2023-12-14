import { jwtDecode } from "jwt-decode";
import getUserResult from "../utils/getUserResult";
import getUserContest from "../utils/getUserContest";
import getUserGameState from "../utils/getUserGameState";

interface decodedToken {
    id: number,
    iat: number,
    exp: number
}

interface answer {
    timestamp: number,
    gamePackID: number,
    questionID: number,
    answer: number | string,
    timeLeft: number,
    score: number,
    isCorrected: boolean
}

async function handleGameAnswer({ strapi, io }, socket, answer) {
    try {
        const { token } = socket.handshake.auth
        const decoded = jwtDecode<decodedToken>(token)
        const { id: userID } = decoded
        const answerObj = <answer>{}
        answerObj.answer = answer
        answerObj.timestamp = Date.now()
        answerObj.timeLeft = 0
        answerObj.score = 0
        answerObj.isCorrected = false

        // get user current contest
        const userContest = await getUserContest(userID, true)
        
        // get user current game state
        const userGameState = await getUserGameState(userID)
        answerObj.timeLeft = userGameState.currentTimeLeft

        // get user current result
        const userResult = await getUserResult(userID)
        const userAnswers: any = userResult.answers ?? []

        // add new answer to result answers
        const gamePacks = userContest ? userContest.gamePacks : []
        const currentGamePack = gamePacks[userGameState?.currentGamePack]
        const currentQuestion = currentGamePack?.questions[userGameState?.currentQuestion]
        answerObj.gamePackID = currentGamePack.id
        answerObj.questionID = currentQuestion.id

        // score answers
        let getAnswer
        switch (currentGamePack.__component) {
            case 'game-packs.quiz-packs':
                [getAnswer] = currentQuestion.answers.filter(answer => answer.id === answerObj.answer)
                break;
        }
        if (getAnswer.isCorrected) {
            let score = currentQuestion.maxScore
            if (currentQuestion.timeLimit) {
                score = Math.round(score * (answerObj.timeLeft / currentQuestion.timeLimit))
            }
            answerObj.score = score
            answerObj.isCorrected = true
        }

        // update result answers and score
        const [existedAnswer] = userAnswers.filter(answer => answer.gamePackID === answerObj.gamePackID && answer.questionID === answerObj.questionID)

        if (existedAnswer) {
            socket.emit('socket:error', {message: 'Question already answered!'})
            return
        }

        userAnswers.push(answerObj)
        const totalScore = userAnswers.reduce((total, answer) => total + answer.score, 0)
        await strapi.entityService.update('api::result.result', userResult.id, {
            data: {
                answers: userAnswers,
                totalScore
            }
        })
    } catch (err) {
        console.log(err)
    }
}

export default handleGameAnswer