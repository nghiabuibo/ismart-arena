import getContestGroup from "./getContestGroup"
import gradeToGroup from "./gradeToGroup"
import removeObjectKey from "./removeObjectKey"

async function getUserContest(userID, showAnswer = false) {
    const user = await strapi.entityService.findOne('plugin::users-permissions.user', userID)

    const group = await gradeToGroup(user.grade)
    const groupID = group.id
    const contestGroup = await getContestGroup(groupID)
    const contestID = contestGroup?.contest?.id

    if (!contestID) return

    const populate = 'gamePacks.questions.illustration, gamePacks.questions.answers'
    const contest = await strapi.entityService.findOne('api::contest.contest', contestID, { populate })

    if (!contest) return

    if (showAnswer) return contest

    return removeObjectKey(contest, 'isCorrected')
}

export default getUserContest