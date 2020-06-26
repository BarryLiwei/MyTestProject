<template>
    <div class="org-structure-tree">
        <el-input class="m-b-10" v-model.trim="filterText" placeholder="请输入搜索内容"></el-input>
        <div class="custom-tree-node flex-1 flex">
            <div class="flex-1 group-title  p-r-20"> 广汽集团 </div>
            <div class="custom-tree-handle">
                <el-dropdown :placement="'right'" class="group_dropdown">
                    <span class="el-dropdown-link">
                        <i class="el-icon-more el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                    <div @click="handleOrg('add', {'id':0, 'name': '广汽集团'})">
                        <el-dropdown-item>新建子组织</el-dropdown-item>
                    </div>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <el-tree
            ref="orgTree"
            :data="orgData"
            :props="defaultProps"
            :default-expanded-keys="expandKeys"
            node-key="id"
            :expand-on-click-node="false"
            @node-expand="nodeExpandFn"
            @node-collapse="nodeCollapseFn" 
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            icon-class="el-icon-arrow-right">
            <div class="custom-tree-node flex-1 flex" slot-scope="{ node, data }">
                <div class="tree-label" :title="node.label">{{ node.label }}</div>
                <div class="custom-tree-handle">
                    <el-dropdown :placement="'right'" class="group_dropdown">
                        <span class="el-dropdown-link">
                            <i class="el-icon-more el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <div @click="handleOrg('add', data)">
                                <el-dropdown-item>新建子组织</el-dropdown-item>
                            </div>
                            <div @click="handleOrg('edit', data, node)">
                                <el-dropdown-item >编辑</el-dropdown-item>
                            </div>
                            <div @click="deleteOrg(data)">
                                <el-dropdown-item >删除</el-dropdown-item>
                            </div>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </el-tree>
    </div>
</template>

<script>
export default {
    data() {
        return {
            filterText: '',
            orgData: [],
            defaultProps: {
                children: 'child',
                label: 'name'
            },
            expandKeys:[]
        };
    },
    created(){
        this.queryData();
    },
    watch: {
        filterText(val) {
            this.$refs.orgTree.filter(val);
        }
    },
    methods: {
        handleNodeClick(data, data2) {
            this.$eventHub.$emit('changeCurrentOrg', data);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
        },
        queryData(){
            let that = this;
            this.$fetch.setting.queryOrgList({}).then((res)=>{
                this.$handleResponse(res, (data)=>{
                    that.orgData = res.data.data.orgStruct; 
                    if(that.$hasArrContent(that.orgData)){
                        // setTimeout(()=>{
                        //     that.$refs.orgTree.setCurrentKey(that.orgData[0].id);
                        //     that.$refs.orgTree.store.nodesMap[that.orgData[0].id].expanded = true;
                        // })
                        that.$eventHub.$emit('changeCurrentOrg', that.orgData[0]);
                        this.$store.commit('closeLoading');
                    }    
                }, false)
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        handleOrg(type, data, node){
            let queryDate = {
                id: '',
                parentId: data.id,
                parentName: data.name,
            }
            if(type == 'edit'){
                let isObj = this.$isObj(node.parent.data);
                queryDate.id = data.id;
                queryDate.parentId = data.pid;
                queryDate.parentName = isObj? node.parent.data.name: '广汽集团';
            }
            this.$router.push({path: type=='add'?'/setting/org-structure/add':'/setting/org-structure/edit', query: queryDate})
        },
        deleteOrg(data){
            this.$confirm('删除后会将此组织的子组织也一并删除，是否确定删除此组织?', '提示', {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "needCenterStyle orgDeleteWidth",
                cancelButtonClass: "big cancel",
                confirmButtonClass: "big",
                roundButton: true,
            }).then(() => {
                this.orgDeleteFn(data);
            })
        },
        orgDeleteFn(data){
            this.$fetch.setting.orgDelete(data.id).then((res)=>{
                this.$handleResponse(res, res => {
                    this.$message.success('删除成功成功');
                    this.queryData();
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        nodeExpandFn(val){
            this.expandKeys.push(val.id);
        },
        nodeCollapseFn(val){
            this.expandKeys = this.expandKeys.filter(item => item != val.id);
        }
    }
};
</script>

<style lang="scss" scoped>
.org-structure-tree {
    padding: 11px 20px 20px;
}

.el-icon--right{
    transform: rotate(-90deg);
    color: #3d7eff;
    display: inline-block;
    height: 35px;
    line-height: 35px;
    width: 30px;
    text-align: center;
}

.el-tree /deep/ .is-current {
    color: #3d7eff;
}

.el-tree /deep/ .is-current .el-tree-node__children {
    color: #606266;
}
.el-tree /deep/ .el-tree-node__expand-icon {
    font-weight: 600;
}

.el-tree /deep/ .is-current  .el-tree-node__expand-icon {
    color: #3d7eff;
}

.el-tree /deep/ .is-current .el-tree-node__children .el-tree-node__expand-icon{
    color: #C0C4CC;
}

.el-tree /deep/ .el-tree-node__content {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
}

.custom-tree-handle {
    width: 35px;
    height: 35px;
    line-height: 35px;
}

.el-tree /deep/ .is-current .el-tree-node__content, 
.el-tree /deep/ .is-focusable .el-tree-node__content {
    background: #fff;
}

.el-tree /deep/ .el-tree-node__content:hover {
    background: #F5F7FA;
}

.group-title {
    font-size: 16px;
    color: #212427;
    font-weight: 600;
}

.custom-tree-node {
    height: 35px;
    line-height: 35px;
    overflow: hidden;

    .tree-label {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
.group_dropdown {
    display: none;
}

.custom-tree-node:hover .group_dropdown {
    display: block;
}
</style>

<style>
.orgDeleteWidth.needCenterStyle .el-message-box__status+.el-message-box__message {
    width: 260px;
    margin: 0 auto;
}
</style>

