<template>
    <el-row class="chart">
        

        <div ref="myChart1" style="width:100%;height:80vh">
            
        </div>

       
    </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import * as echarts from 'echarts'

require('echarts/theme/vintage')
export default {
    components:{
        CountTo,
    },
    props:{
        seriesData:{
            type:Object,
            default:()=>{},
        },
    },
    data(){
        return{
            chart:null,
            showData:{},
        }
    },
    methods:{
        // //数据处理：方便legend使用
        // handleData(){
        //     // const result = Object.values(this.seriesData).flatMap(arr => arr.map(obj => obj.name));
        //     return result
        // },

        // 可视化的相关
        initChart(){
            // let labels = this.handleData()
            this.chart = echarts.init(this.$refs.myChart1)

            this.chart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    /**
                    data: [
                    'Direct',
                    'Marketing',
                    'Search Engine',
                    'Email',
                    'Union Ads',
                    'Video Ads',
                    'Baidu',
                    'Google',
                    'Bing',
                    'Others'
                    ]
                    */
                    data:this.seriesData['2']
                },
                series: [
                    {
                        name: '一级标签',       //内层饼图标题
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '35%'],     //内层饼图大小
                        label: {
                            position: 'inner',
                            fontSize: 14
                        },
                        labelLine: {
                            show: false     //标签连线 （内部标签不显示）
                        },
                        // data:[
                        //     { value: 1548, name: 'Search Engine' },
                        //     { value: 775, name: 'Direct' },
                        //     { value: 679, name: 'Marketing' }       //参数：selected：true  是否被选中
                        // ]
                        data: this.seriesData['1']
                    },
                    {
                        name: '二级标签',
                        type: 'pie',
                        radius: ['45%', '60%'],
                        labelLine: {
                            length: 30
                        },
                        label: {
                            // {a}：系列名。
                            // {b}：数据名。
                            // {c}：数据值。
                            // {d}：百分比。
                            // {@xxx}：数据中名为 'xxx' 的维度的值，如 {@product} 表示名为 'product' 的维度的值。
                            // {@[n]}：数据中维度 n 的值，如 {@[3]} 表示维度 3 的值，从 0 开始计数。
                            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                            backgroundColor: '#F6F8FC',
                            borderColor: '#8C8D8E',
                            borderWidth: 1,
                            borderRadius: 4,
                            rich: {
                            a: {
                                color: '#6E7079',
                                lineHeight: 22,
                                align: 'center'
                            },
                            hr: {
                                borderColor: '#8C8D8E',
                                width: '100%',
                                borderWidth: 1,
                                height: 0
                            },
                            b: {
                                color: '#4C5058',
                                fontSize: 14,
                                fontWeight: 'bold',
                                lineHeight: 33
                            },
                            per: {
                                color: '#fff',
                                backgroundColor: '#4C5058',
                                padding: [3, 4],
                                borderRadius: 4
                            }
                            }
                        },
                        /**[
                            { value: 1048, name: 'Baidu' },
                            { value: 335, name: 'Direct' },
                            { value: 310, name: 'Email' },
                            { value: 251, name: 'Google' },
                            { value: 234, name: 'Union Ads' },
                            { value: 147, name: 'Bing' },
                            { value: 135, name: 'Video Ads' },
                            { value: 102, name: 'Others' }
                        ]
                        */
                        data:this.seriesData['2']
                    }
                ]
            })

        }
    },
    mounted() {
        this.$nextTick(()=>{
            this.initChart()
        })
        
    },
    beforeDestroy(){
        if(!this.chart){
            return 
        }
        this.chart.dispose()
        this.chart = null
    }
}
</script>