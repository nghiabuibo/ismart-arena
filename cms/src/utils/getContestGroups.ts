async function getContestGroups(isAdmin = false) {
    const populate: any = ['contestGroups.group', 'contestGroups.contest.titleImage', 'contestGroups.state']
    if (isAdmin) {
        populate.push('contestGroups.contest.gamePacks.questions')
    }
    const contestSettings: any = await strapi.entityService.findMany('api::contest-setting.contest-setting', {
        populate
    })

    return contestSettings?.contestGroups ?? []
}

export default getContestGroups