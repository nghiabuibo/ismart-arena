import getContestGroups from "./getContestGroups"

async function getContestGroup(groupID) {
    const contestGroups = await getContestGroups()

    const [contestGroup] = contestGroups.filter(contestGroup => contestGroup.group?.id === groupID)

    if (contestGroup?.state?.currentTimeLeft <= 0) {
        const contests = await strapi.entityService.findOne('api::contest.contest', contestGroup.contest?.id, {
            populate: 'gamePacks.questions.answers'
        })
        const gamePack = contests?.gamePacks[contestGroup.state.currentGamePack]
        const question = gamePack?.questions[contestGroup.state.currentQuestion]
        const correctedAnswers = question?.answers?.filter(answer => answer.isCorrected) ?? []
        contestGroup.state.correctedAnswers = correctedAnswers
    }

    return contestGroup
}

export default getContestGroup