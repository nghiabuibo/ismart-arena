interface Strapi {
    [key: string]: any
}

async function getLeaderboard(contest, group) {
    if (!contest.id || !group.id) return

    // const leaderboard = await strapi.entityService.findMany('api::result.result', {
    //     filters: {
    //         contest: contest.id,
    //         group: group.id
    //     },
    //     populate: 'user',
    //     sort: [
    //         { totalCorrected: 'desc' },
    //         { totalScore: 'desc' }
    //     ],
    //     limit: -1
    // })

    const leaderboard = (strapi as Strapi).gameData.results.filter(result => result.contest.id === contest.id && result.group.id === group.id)
        .sort((a, b) => {
            if (a.totalCorrected !== b.totalCorrected) {
                // If totalCorrected are different, sort by totalCorrected in descending order
                return b.totalCorrected - a.totalCorrected;
            } else {
                // If totalCorrected are the same, sort by totalScore in descending order
                return b.totalScore - a.totalScore;
            }
        })

    for (const i in leaderboard) {
        const entry: any = leaderboard[i]
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