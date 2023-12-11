import getContestGroup from "./getContestGroup"
import gradeToGroup from "./gradeToGroup"

async function getUserGameState(userID) {
    const user = await strapi.entityService.findOne('plugin::users-permissions.user', userID)

    const group = await gradeToGroup(user.grade)
    const groupID = group.id
    const contestGroup = await getContestGroup(groupID)
    return contestGroup?.state
}

export default getUserGameState