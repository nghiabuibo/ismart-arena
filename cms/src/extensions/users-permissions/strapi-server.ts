export default (plugin) => {
    plugin.controllers.user.apiToken = async (ctx) => {
        const [_, isAdmin, message] = await strapi.services['admin::auth'].checkCredentials(ctx.request.body)
        if (!isAdmin) return ctx.badRequest(message.message)

        ctx.send({token: process.env.API_TOKEN})
    }

    plugin.routes['content-api'].routes.push({
        method: 'POST',
        path: '/api-token',
        handler: 'user.apiToken',
    })
    return plugin
}