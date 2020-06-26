<template>
    <div class="flex clue-cascader-component" style="justify-item:space-between">
        <el-select v-model="search.oneVal" :placeholder="onePlaceholder" filterable @change="fristChange(search)" :remote="oneRemote" v-bind="$attrs" v-on="$listeners">
            <el-option v-for="(item, index) in search.oneOptions" :key="'one'+index" :label="item[search.oneOptionLabel]" :value="item[search.oneOptionValue]"></el-option>
        </el-select>
        <el-select v-model="search.secondVal" class="m-l-10" :placeholder="secondPlaceholder" filterable @change="secondChange(search)" v-bind="$attrs" v-on="$listeners">
            <el-option v-if="search.isAll && search.secondOptions && search.secondOptions.length" :label="search.isAllTitle" value=" " ></el-option>
            <el-option v-for="(item, index) in search.secondOptions" :key="'second'+index" :label="item[search.secondOptionLabel]" :value="item[search.secondOptionValue]"></el-option>
        </el-select>
    </div>
</template>

<script>
// 此组件是用来一级二级的联动处理
export default {
    props: {
        search: {
            type: Object,
            default: ()=>{
                return {
                  oneVal: '', // 一级绑定的值
                  oneOptions:[],
                  oneOptionLabel: 'name', // 一级下拉对应的字段取值
                  oneOptionValue: 'id',
                  secondVal:'', // 二级绑定的值
                  secondOptions: [],
                  secondOptionLabel: 'name',
                  secondOptionValue: 'id',
                }
            }
        },
        onePlaceholder: {
            type: String,
            default: '一级来源'
        },
        secondPlaceholder: {
            type: String,
            default: '二级来源'
        },
        oneRemote: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            oneObj: {},
        }
    },
    methods: {
        fristChange(search){
            if(!Object.keys(this.oneObj).length && search.oneOptions.length){
                search.oneOptions.forEach((item)=>{
                    this.oneObj[item[search.oneOptionValue]] = item;
                })
            }
            this.$emit('fristChange', search.oneVal, this.oneObj[search.oneVal])
        },
        secondChange(search){
            this.$emit('secondChange', search.secondVal)
        }
    }
    
}
</script>

