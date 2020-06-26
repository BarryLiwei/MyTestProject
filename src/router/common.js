export default [
    // {
    //     path: '/',
    //     redirect: '/login'
    // },
    {
        path: '/login',
        name: 'login',
        meta: {},
        component: () => import('@/pages/login/Login.vue')
    }
]