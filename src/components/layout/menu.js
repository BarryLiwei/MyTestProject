// 头部菜单，测试的时候用，另外配菜单可以参考
// 菜单配置  /business/seat/seat-manage/xxxx   按顺序前三级的菜单，当前选中的菜单高亮是按照最多前三级来配置
export default [
    {
        url: "work",
        name: "工作台"
    }, {
        url: "call",
        name: "呼叫中心",
        child: [
            {
                url: "call/task",
                name: "任务管理",
                child: [
                    {
                        url: "call/task/talk",
                        name: "开口任务"
                    }
                ]
            }, {
                url: "call/know",
                name: "知识库管理",
                child: [
                    {
                        url: "call/know/attack",
                        name: "攻防话术"
                    }, {
                        url: "call/know/activity",
                        name: "活动管理"
                    }, {
                        url: "call/know/normal",
                        name: "常用话术"
                    }
                ]
            }, {
                url: "call/seat",
                name: "坐席管理",
                child: [
                    {
                        url: "call/seat/seat-manage",
                        name: "坐席组管理"
                    }, {
                        url: "call/seat/seat-setting",
                        name: "坐席设置"
                    }
                ]
            }, {
                url: "call/media-manage",
                name: "垂媒管理",
            }, {
                url: "call/call-record",
                name: "通话记录",
            }, {
                url: "call/param",
                name: "参数设置",
                child: [
                    {
                      url: "call/param/dcc",
                      name: "DCC跟进规则设置"
                    }, {
                      url: "call/param/defeat",
                      name: "战败原因设置"
                    }, {
                      url: "call/param/invalid",
                      name: "无效原因设置"
                    }, {
                      url: "call/param/source",
                      name: "线索/客户来源设置"
                    }, {
                      url: "call/param/clue",
                      name: "线索设置"
                    }, {
                      url: "call/param/optional",
                      name: "可选设置"
                    }
                ]
            }
        ]
    }, {
        url: "business",
        name: "业务管理",
        child: [
            {
                url: "business/clue",
                name: "线索管理",
            },
            {
                url: "business/potential",
                name: "潜客管理",
            },
            {
                url: "business/invite",
                name: "邀约管理",
            },
            {
                url: "business/order",
                name: "订单管理",
            }, {
                url: "business/defeat",
                name: "战败记录",
            },
        ]
    }, {
        url: "setting",
        name: "系统设置",
        child: [{
                url: "setting/group-people",
                name: "集团人员",
            }, {
                url: "setting/role-power",
                name: "角色权限",
            }, {
                url: "setting/group-shop",
                name: "集团门店",
            }, {
                url: "setting/org-structure",
                name: "组织架构",
            }, 
        ]
    }
]