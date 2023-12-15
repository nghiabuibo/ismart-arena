async function getLeaderboard(contest, group) {
    if (!contest.id || !group.id) return

    const leaderboard = await strapi.entityService.findMany('api::result.result', {
        filters: {
            contest: contest.id,
            group: group.id
        },
        populate: 'user',
        sort: {
            totalScore: 'desc'
        },
        limit: 10
    })
    return {
        contest,
        group,
        leaderboard
    }
}

export default getLeaderboard