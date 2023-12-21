async function getLeaderboard(contest, group) {
    if (!contest.id || !group.id) return

    const leaderboard = await strapi.entityService.findMany('api::result.result', {
        filters: {
            contest: contest.id,
            group: group.id
        },
        populate: 'user',
        sort: [
            { totalCorrected: 'desc' },
            { totalScore: 'desc' }
        ],
        limit: -1
    })

    for (const i in leaderboard) {
        const entry:any = leaderboard[i]
        const userPhone = `******${entry.user.phone.substr(entry.user.phone.length - 4)}`
        entry.user.phone = userPhone
    }
    
    return {
        contest,
        group,
        leaderboard
    }
}

export default getLeaderboard