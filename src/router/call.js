export default [
    {
        path: '/call',
        component: () => import('@/components/layout/HeaderBody.vue'),
        children: [
            {
                path: '/',
                component: () => import('@/components/layout/SideMain.vue'),
                children:[
                    {
                        path: 'task/talk',
                        name: '开口任务',
                        meta: {},
                        component: () => import('@/pages/call-center/task/TalkTask.vue'),
                    },{
                        path: 'know/attack',
                        name: '攻防话术',
                        meta: {},
                        component: () => import('@/pages/call-center/know/attack/Attack.vue'),
                    },{
                        path: 'know/activity',
                        name: '活动管理',
                        meta: {},
                        component: () => import('@/pages/call-center/know/activity/Activity.vue'),
                    },{
                        path: 'know/normal',
                        name: '常用话术',
                        meta: {},
                        component: () => import('@/pages/call-center/know/normal/Normal.vue'),
                    },{
                        path: 'seat/seat-manage',
                        name: '坐席组管理',
                        meta: {},
                        component: () => import('@/pages/call-center/seat/seat-manage/SeatManage.vue'),
                    },{
                        path: 'seat/seat-manage/add',
                        name: '新增坐席组',
                        meta: {
                            authPath: '/call/seat/seat-manage', // 判断是否有这个菜单
                        },
                        component: () => import('@/pages/call-center/seat/seat-manage/AddSeatGroup.vue'),
                    },{
                        path: 'seat/seat-manage/edit',
                        name: '编辑坐席组',
                        meta: {
                            authPath: '/call/seat/seat-manage', // 判断是否有这个菜单
                        },
                        component: () => import('@/pages/call-center/seat/seat-manage/AddSeatGroup.vue'),
                    },{
                        path: 'seat/seat-setting',
                        name: '坐席设置',
                        meta: {},
                        component: () => import('@/pages/call-center/seat/seat-setting/SeatSetting.vue'),
                    },{
                        path: 'media-manage',
                        name: '垂媒管理',
                        meta: {},
                        component: () => import('@/pages/call-center/media/MediaManage.vue'),
                    },{
                        path: 'call-record',
                        name: '通话记录',
                        meta: {},
                        component: () => import('@/pages/call-center/record/CallRecord.vue'),
                    },{
                        path: 'param/dcc',
                        name: 'DCC跟进规则设置',
                        meta: {},
                        component: () => import('@/pages/call-center/param/Dcc.vue'),
                    },{
                        path: 'param/defeat',
                        name: '战败原因设置',
                        meta: {},
                        component: () => import('@/pages/call-center/param/Defeat.vue'),
                    },{
                        path: 'param/invalid',
                        name: '无效原因设置',
                        meta: {},
                        component: () => import('@/pages/call-center/param/Invalid.vue'),
                    },{
                        path: 'param/source',
                        name: '线索/客户来源设置',
                        meta: {},
                        component: () => import('@/pages/call-center/param/Source.vue'),
                    },{
                        path: 'param/clue',
                        name: '线索设置',
                        meta: {},
                        component: () => import('@/pages/call-center/param/Clue.vue'),
                    },{
                        path: 'param/optional',
                        name: '可选设置',
                        meta: {},
                        component: () => import('@/pages/call-center/param/Optional.vue'),
                    }
                ]
            }
        ]
    }
]