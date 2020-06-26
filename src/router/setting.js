export default [
    {
        path: '/setting',
        component: () => import('@/components/layout/HeaderBody.vue'),
        children: [
            {
                path: '/',
                component: () => import('@/components/layout/SideMain.vue'),
                children:[
                    {
                        path: 'group-people',
                        name: '集团人员',
                        meta: {},
                        component: () => import('@/pages/setting/people/GroupPeople.vue'),
                    },{
                        path: 'role-power',
                        name: '角色权限',
                        meta: {},
                        component: () => import('@/pages/setting/role/Role.vue'),
                    },{
                        path: 'role-power/add',
                        name: '新增角色',
                        meta: {
                            authPath: '/setting/role-power', // 判断是否有这个菜单
                        },
                        component: () => import('@/pages/setting/role/AddRole.vue'),
                    },{
                        path: 'role-power/edit',
                        name: '编辑角色',
                        meta: {
                            authPath: '/setting/role-power', // 判断是否有这个菜单
                        },
                        component: () => import('@/pages/setting/role/AddRole.vue'),
                    },{
                        path: 'group-shop',
                        name: '集团门店',
                        meta: {},
                        component: () => import('@/pages/setting/shop/GroupShop.vue'),
                    },{
                        path: 'org-structure',
                        name: '组织架构',
                        meta: {},
                        component: () => import('@/pages/setting/org/OrgStructure.vue'),
                    },{
                        path: 'org-structure/add',
                        name: '新增组织',
                        meta: {
                            authPath: '/setting/org-structure', // 判断是否有这个菜单
                        },
                        component: () => import('@/pages/setting/org/AddOrg.vue'),
                    },{
                        path: 'org-structure/edit',
                        name: '编辑组织',
                        meta: {
                            authPath: '/setting/org-structure', // 判断是否有这个菜单
                        },
                        component: () => import('@/pages/setting/org/AddOrg.vue'),
                    }
                ]
            }
        ]
    }
]