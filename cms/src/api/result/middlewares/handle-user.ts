import getRoleIDByName from "../../../utils/getRoleIDbyName";
import crypto from "crypto"

export default () => {
    return async (ctx, next) => {
        const { data } = ctx.request.body
        
        if (!data.userID) {
            const { phone } = data
            const roleID = await getRoleIDByName('authenticated')
            data.username = crypto.randomUUID()
            data.password = phone
            data.role = roleID
            data.provider = 'local'
            const user = await strapi.entityService.create('plugin::users-permissions.user', { data })
            ctx.request.body.userID = user.id
        }
        
        await next();
        
        const accessToken = strapi.plugin('users-permissions').services.jwt.issue({ id: ctx.request.body.userID })
        ctx.response.body.accessToken = accessToken
    };
};