export default [
    {
        path: '/business',
        component: () => import('@/components/layout/HeaderBody.vue'),
        children: [
            {
                path: '/',
                component: () => import('@/components/layout/SideMain.vue'),
                children:[
                    {
                        path: 'clue',
                        name: '线索管理',
                        meta: {},
                        component: () => import('@/pages/business/clue/Clue.vue'),
                    },{
                        path: 'clue/detail',
                        name: '线索详情',
                        meta: {
                            authPath: '/business/clue', // 判断是否有这个菜单
                        },
                        component: () => import('@/pages/business/clue/ClueDetail.vue'),
                    },{
                        path: 'potential',
                        name: '潜客管理',
                        meta: {},
                        component: () => import('@/pages/business/potential/Potential.vue'),
                    },{
                        path: 'potential/detail',
                        name: '潜客详情',
                        meta: {
                            authPath: '/business/potential', // 判断是否有这个菜单
                        },
                        component: () => import('@/pages/business/potential/PotentialDetail.vue'),
                    },{
                        path: 'invite',
                        name: '邀约管理',
                        meta: {},
                        component: () => import('@/pages/business/invite/Invite.vue'),
                    },{
                        path: 'order',
                        name: '订单管理',
                        meta: {
                            authPath: '/business/order', // 判断是否有这个菜单
                        },
                        component: () => import('@/pages/business/order/Order.vue'),
                    },{
                        path: 'defeat',
                        name: '战败记录',
                        meta: {
                            authPath: '/business/defeat', // 判断是否有这个菜单
                        },
                        component: () => import('@/pages/business/defeat/Defeat.vue'),
                    }
                ]
            }
        ]
    }
]