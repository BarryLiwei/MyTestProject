<template>
    <div class="message-list-page">
        <div class="common-box">
            <h2>消息中心</h2>
            <data-table ref="DataTableRef" :table="dataTable" @searchTable='searchTable' class="message-table">
                <template slot-scope="props" slot="content">
                    <a :href="props.obj.row.extend" :target="props.obj.row.type == 3 ? '_self' : '_blank'">{{ props.obj.row.content}}</a>
                </template> 
            </data-table>
        </div>
    </div>
</template>

<script>
import DataTable from "@/components/dataTable/table";
export default {
    components: {
        DataTable
    },
    data() {
        return {
            dialogVisible: true,
            dataTable: {
                tr: [{
                      id: '1',
                      label: '接收时间',
                      prop: 'created_at',
                      align: 'center',
                      width: '200',
                    }, {
                      id: '2',
                      label: '消息类型',
                      prop: 'type_text',
                      width: '240',
                      tooltip: true
                    }, {
                      id: '3',
                      label: '内容',
                      prop: 'content',
                      show:'template'
                    }
                ],
                data: [],
                page: {
                    totalCount: 0,
                    pageSize: 20,
                    currentPage: 1
                },
                height: '500px',
                hasSelect: false, //是否有复选框
                hasExpand: false, //是否有收缩功能
                hasFirstPagination: false, //是否有第一条分页条
                lastPageLayout: 'sizes, prev, pager, next', // 最后一行的分页是否显示sizes
                hasOperation: false, // 显示最后的operations
                operation: []
            }
        }
    },
    created() {
        this.queryData()
    },
    methods: {
        searchTable(params){ // table 上的搜索
            this.dataTable.page.currentPage = params.page;
            this.queryData();
        },
        queryData() {
            const { currentPage, pageSize } = this.dataTable.page;
            let params = {
                per_page: pageSize,
                page: currentPage
            }
            this.$fetch.work.messageList(params).then((res) => {
                this.$handleResponse(res, data => {
                    this.dataTable.data = data.list || []; 
                    this.dataTable.page = data.page || 1; 
                }, true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.message-list-page {
    padding: 20px;
    .common-box {
        padding: 20px;
    }
    .message-table {
        margin-top: 20px;
        /deep/ .el-table {
            border: 1px solid #EBEEF5;
            border-bottom: 0;
            color: #444;

            .el-table__header .has-gutter tr th {
                background-color: #fff;
                color: #444;
            }

            a {
                color: #3d7eff;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
}

</style>

