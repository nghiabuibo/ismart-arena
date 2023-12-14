import getContestGroup from "./getContestGroup"
import getLeaderboard from "./getLeaderboard"
import gradeToGroup from "./gradeToGroup"

async function getUserLeaderboard(userID) {
    const user = await strapi.entityService.findOne('plugin::users-permissions.user', userID)

    const group = await gradeToGroup(user.grade)
    const groupID = group.id
    const contestGroup = await getContestGroup(groupID)

    const leaderboard = getLeaderboard(contestGroup.contest, contestGroup.group)
    return leaderboard
}

export default getUserLeaderboard