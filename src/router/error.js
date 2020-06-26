export default [
    {
        path: '*',
        component: () => import('@/components/layout/HeaderBody.vue'),
        children: [
            {
                path: '*',
                component: () => import('@/pages/error/404.vue')
            }
        ]
    }
]