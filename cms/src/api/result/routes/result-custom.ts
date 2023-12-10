
export default {
    routes: [
        {
            method: 'POST',
            path: '/results/register',
            handler: 'result.register',
            config: {
                policies: ['validate-user'],
                middlewares: ['api::result.handle-user']
            }
        }
    ]
}