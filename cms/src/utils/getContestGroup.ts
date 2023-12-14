import getContestGroups from "./getContestGroups"

async function getContestGroup(groupID) {
    const contestGroups = await getContestGroups()

    const [contestGroup] = contestGroups.filter(contestGroup => contestGroup.group?.id === groupID)
    return contestGroup
}

export default getContestGroup