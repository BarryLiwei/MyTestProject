export default [
    {
        path: '/work',
        component: () => import('@/components/layout/HeaderBody.vue'),
        children: [
            {
                path: '/',
                component: () => import('@/components/layout/RouterEmpty.vue'),
                children:[
                    {
                        path: '',
                        name: 'work', 
                        meta: {
                            authPath: '/work', // 判断是否有这个菜单
                        },
                        component: () => import('@/pages/work/Work.vue')
                    },
                    {
                      path: 'cluesDeal',
                      name: 'cluesDeal',
                      meta: {
                          authPath: '/work', // 判断是否有这个菜单
                      },
                      component: () => import('@/pages/work/CluesDeal.vue'),
                    },
                    {
                        path: 'customerFollow',
                        name: 'customerFollow',
                        meta: {
                            authPath: '/work', // 判断是否有这个菜单
                        },
                        component: () => import('@/pages/work/CustomerFollow.vue'),
                    },
                    {
                        path: 'messageList',
                        name: 'messageList',
                        meta: {
                            authPath: '/work', // 判断是否有这个菜单
                        },
                        component: () => import('@/pages/work/MessageList.vue'),
                    }
                ]
            },
            
        ]
    }
]