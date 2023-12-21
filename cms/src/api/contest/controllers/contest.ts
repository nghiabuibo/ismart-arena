/**
 * contest controller
 */

import { factories } from '@strapi/strapi'
import getRoleIDByName from "../../../utils/getRoleIDbyName";
import crypto from "crypto"

export default factories.createCoreController('api::contest.contest', ({ strapi }) => ({
    async register(ctx) {
        try {
            const { data } = ctx.request.body
            if (!ctx.request.body.userID) {
                const { phone } = data
                const roleID = await getRoleIDByName('authenticated')
                const randomUUID = crypto.randomUUID()
                data.username = randomUUID
                data.email = `${randomUUID}@gmail.com`
                data.password = phone
                data.role = roleID
                data.provider = 'local'
                const user = await strapi.entityService.create('plugin::users-permissions.user', { data })
                ctx.request.body.userID = user.id
            }

            const accessToken = strapi.plugin('users-permissions').services.jwt.issue({ id: ctx.request.body.userID })
            ctx.send({ accessToken })
        } catch (err) {
            ctx.body = err
        }
    }
}));