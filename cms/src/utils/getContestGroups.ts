async function getContestGroups() {
    const contestSettings = await strapi.entityService.findMany('api::contest-setting.contest-setting', {
        populate: 'contestGroups.group, contestGroups.contest, contestGroups.state'
    })

    return contestSettings.contestGroups
}

export default getContestGroups