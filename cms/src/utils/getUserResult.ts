import gradeToGroup from "../utils/gradeToGroup";
import getContestGroup from "./getContestGroup";

async function getUserResult(userID) {
    const user = await strapi.entityService.findOne('plugin::users-permissions.user', userID)

    // convert user grade to group and get group contest data from setting
    const group = await gradeToGroup(user.grade)
    const groupID = group.id
    const contestGroup = await getContestGroup(groupID)

    // check if user has contest result, create new if not
    // return game data and user result
    const contestID = contestGroup?.contest?.id

    if (!contestID) return

    const [existedResult] = await strapi.entityService.findMany('api::result.result', {
        filters: {
            $and: [
                { contest: { id: contestID } },
                { group: { id: groupID } },
                { user: { id: userID } }
            ],
        }
    })

    if (existedResult) return existedResult

    const newResult = await strapi.entityService.create('api::result.result', {
        data: {
            contest: contestID,
            group: groupID,
            user: userID
        }
    })
    
    return newResult       
}

export default getUserResult