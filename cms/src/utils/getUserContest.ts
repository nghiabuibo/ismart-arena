import getContestGroup from "./getContestGroup"
import gradeToGroup from "./gradeToGroup"
import removeObjectKey from "./removeObjectKey"

async function getUserContest(userID, showAnswer = false) {
    const user = await strapi.entityService.findOne('plugin::users-permissions.user', userID)

    const group = await gradeToGroup(user.grade)
    const groupID: any = group.id
    const contestGroup = await getContestGroup(groupID)
    const contestID = contestGroup?.contest?.id

    if (!contestID) return

    const populate = 'gamePacks.questions.illustration, gamePacks.questions.answers'
    const contest = await strapi.entityService.findOne('api::contest.contest', contestID, { populate })

    if (!contest) return

    // process word find game data
    const gameState = contestGroup.state
    const currentGamePack = contest.gamePacks[gameState.currentGamePack]
    if (currentGamePack.__component === 'game-packs.word-find-packs' && currentGamePack.questions && currentGamePack.questions.length) {
        const currentQuestion: any = currentGamePack.questions[gameState.currentQuestion]
        if (currentQuestion.answers && currentQuestion.answers.length) {
            // get found words
            const results = await strapi.entityService.findMany('api::result.result', {
                filters: {
                    contest: contestID,
                    group: groupID
                },
                limit: -1
            })

            const foundWords = []
            results.forEach(result => {
                const userAnswers: any = result.answers ?? []
                const userFoundWords = userAnswers
                    .filter(userAnswer => userAnswer.gamePackID === currentGamePack.id && userAnswer.questionID === currentQuestion.id)
                    .map(userAnswer => userAnswer.answer)
                foundWords.push(...userFoundWords)
            })

            // attach to question object
            currentQuestion.foundWords = foundWords
        }
    }

    if (showAnswer) return contest

    return removeObjectKey(contest, 'isCorrected')
}

export default getUserContest