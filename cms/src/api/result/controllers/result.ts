/**
 * result controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::result.result', ({ strapi }) => ({
    async register(ctx) {
        try {
            const { data, userID } = ctx.request.body
            const { grade } = data
            const gradeInt = parseInt(grade)
    
            let groupCode
            switch (gradeInt) {
                case 1:
                case 2:
                    groupCode = 'kids'
                    break;
                case 3:
                case 4:
                case 5:
                    groupCode = 'junior'
                    break;
            }
            const contestSettings = await strapi.entityService.findMany('api::contest-setting.contest-setting', {
                populate: {
                    contestGroups: {
                        populate: {
                            group: true,
                            contest: true
                        }
                    }
                }
            })
            const [contestGroup] = contestSettings.contestGroups.filter(contestGroup => contestGroup.group.code === groupCode)
            if (!contestGroup) {
                return ctx.badRequest('Invalid contest group config!')
            }
    
            const groupID = contestGroup.group.id
            const contestID = contestGroup.contest.id
            const [existedResult] = await strapi.entityService.findMany('api::result.result', {
                filters: {
                    $and: [
                        { contest: { id: contestID } },
                        { group: { id: groupID } },
                        { user: { id: userID } }
                    ],
                }
            })
            
            if (existedResult) {
                return ctx.send({
                    result: existedResult
                })
            }

            const newResult = await strapi.entityService.create('api::result.result', {
                data: {
                    contest: contestID,
                    group: groupID,
                    user: userID
                }
            })

            return ctx.send({
                result: newResult
            })
        } catch (err) {
            ctx.body = err
        }
    }
}));
