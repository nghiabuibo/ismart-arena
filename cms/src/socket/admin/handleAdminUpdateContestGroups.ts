function handleAdminUpdateContestGroups({ strapi, io }, socket, newContestGroups) {
    try {
        strapi.entityService.update('api::contest-setting.contest-setting', 1, {
            data: {
                contestGroups: newContestGroups
            }
        })
    } catch (err) {
        console.log(err)
    }
}

export default handleAdminUpdateContestGroups