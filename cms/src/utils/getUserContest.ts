import getContestGroup from "./getContestGroup"
import gradeToGroup from "./gradeToGroup"

async function getUserContest(userID) {
    const user = await strapi.entityService.findOne('plugin::users-permissions.user', userID)

    const group = await gradeToGroup(user.grade)
    const groupID = group.id
    const contestGroup = await getContestGroup(groupID)
    const contestID = contestGroup?.contest?.id

    if (!contestID) return
    
    const contest = await strapi.entityService.findOne('api::contest.contest', contestID, {populate: 'gamePacks.questions.answers'})
    return contest
}

export default getUserContest