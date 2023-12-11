async function getContestGroup(groupID) {
    const contestSettings = await strapi.entityService.findMany('api::contest-setting.contest-setting', {
        populate: 'contestGroups.group, contestGroups.contest, contestGroups.state'
    })

    const [contestGroup] = contestSettings.contestGroups.filter(contestGroup => contestGroup.group?.id === groupID)
    return contestGroup
}

export default getContestGroup