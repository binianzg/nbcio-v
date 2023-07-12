<template>
  <div>
    <button @click="changeType">切换图表类型</button>
    <!--<ve-chart :data="chartData" :settings="chartSettings"></ve-chart>-->
    <bs-chart :options="options" autoresize />
  </div>
</template>

<script>
  // 饼状图
  export default {
    data() {
      this.typeArr = ['line', 'histogram', 'pie']
      this.index = 0
      return {
        options: {
           "title": {
                  "text": "",
                  "show": true,
                  "left": "center",
                  "textStyle": {
                      "color": "#FFD700",
                      "fontSize": 20,
                      "fontWeight": "normal",
                      "fontStyle": "normal"
                  },
                  "subtext": "",
                  "subtextStyle": {
                      "color": "",
                      "fontWeight": "normal",
                      "fontSize": 20,
                      "fontStyle": "normal"
                  }
              },
              "legend": {
                  "orient": "horizontal",
                  "left": "auto",
                  "textStyle": {
                      "color": "#fff",
                      "fontSize": 16
                  },
                  "show": true,
                  "right": "auto",
                  "top": 0,
                  "bottom": "auto",
                  "itemWidth": 15
              },
              "series": [
                  {
                      "type": "pie",
                      "radius": "50%",
                      "data": [
                          {
                              "value": 1048,
                              "name": "搜索引擎"
                          },
                          {
                              "value": 735,
                              "name": "直接访问"
                          },
                          {
                              "value": 580,
                              "name": "邮件营销"
                          },
                          {
                              "value": 484,
                              "name": "联盟广告"
                          },
                          {
                              "value": 300,
                              "name": "视频广告"
                          }
                      ],
                      "emphasis": {
                          "itemStyle": {
                              "shadowBlur": 10,
                              "shadowOffsetX": 0,
                              "shadowColor": "rgba(0, 0, 0, 0.5)"
                          }
                      },
                      "label": {
                          "show": true,
                          "formatter": "{a|{b}：{c} }",
                          "rich": {
                              "a": {
                                  "padding": [
                                      -30,
                                      15,
                                      -20,
                                      15
                                  ],
                                  "color": "",
                                  "fontSize": 12,
                                  "fontWeight": "normal"
                              }
                          },
                          "fontSize": 12
                      },
                      "labelLine": {
                          "show": true
                      }
                  }
              ],
              "tooltip": {
                  "trigger": "item",
                  "show": true,
                  "textStyle": {
                      "fontSize": 16
                  }
              },
              "color": [
                  "#0CD2E6",
                  "#00BFA5",
                  "#FFC722",
                  "#886EFF",
                  "#008DEC"
              ]
      },
      
    optionsStyle: {}, // 样式
    optionsData: {}, // 数据
    optionsCollapse: {}, // 图标属性
    optionsSetup: {
            "layerName": "饼图",
            "background": "",
            "piechartStyle": "shixin",
            "isNoTitle": true,
            "titleText": "",
            "textColor": "#FFD700",
            "textFontSize": 20,
            "textFontWeight": "normal",
            "textFontStyle": "normal",
            "textAlign": "center",
            "subText": "",
            "subTextColor": "",
            "subTextFontSize": 20,
            "subTextFontWeight": "normal",
            "subTextFontStyle": "normal",
            "isShow": true,
            "numberValue": true,
            "percentage": false,
            "fontSize": 12,
            "fontWeight": "normal",
            "tipFontSize": 16,
            "tipsColor": "#00FEFF",
            "isShowLegend": true,
            "legendColor": "#fff",
            "legendFontSize": 16,
            "legendWidth": 15,
            "lateralPosition": "center",
            "longitudinalPosition": "top",
            "layoutFront": "horizontal",
            "customColor": [
                {
                    "color": "#0CD2E6"
                },
                {
                    "color": "#00BFA5"
                },
                {
                    "color": "#FFC722"
                },
                {
                    "color": "#886EFF"
                },
                {
                    "color": "#008DEC"
                }
            ]
    },
    chartData: {
      columns: ['日期', '访问用户'],
      rows: [{
          '日期': '1月1日',
          '访问用户': 1523
        },
        {
          '日期': '1月2日',
          '访问用户': 1223
        },
        {
          '日期': '1月3日',
          '访问用户': 2123
        },
        {
          '日期': '1月4日',
          '访问用户': 4123
        },
        {
          '日期': '1月5日',
          '访问用户': 3123
        },
        {
          '日期': '1月6日',
          '访问用户': 7123
        }
      ]
    },
    chartSettings: {
      type: this.typeArr[this.index]
    }
  }
  },
  created() {
      //this.options.series.data = this.chartData;
      //this.optionsData = this.chartData;
      this.editorOptions();
    },
    methods: {
      changeType: function() {
        this.index++
        if (this.index >= this.typeArr.length) {
          this.index = 0
        }
        this.chartSettings = {
          type: this.typeArr[this.index]
        }
      },
      // 修改图标options属性
      editorOptions() {
        console.log("editorOptions this.optionsSetup", this.optionsSetup)
        console.log("editorOptions this.options", this.options)
        this.setOptionsTitle();
        this.setOptionsValue();
        this.setOptionsTooltip();
        this.setOptionsLegend();
        this.setOptionsColor();
        //this.setOptionsData();
        this.setOptionsPiechartStyle();
      },
      // 饼图样式
      setOptionsPiechartStyle() {
        if (this.optionsSetup.piechartStyle == "shixin") {
          this.options.series[0]["radius"] = "50%";
        } else if (this.optionsSetup.piechartStyle == "kongxin") {
          this.options.series[0]["radius"] = ["40%", "70%"];
        } else {}
      },
      // 标题设置
      setOptionsTitle() {
        const optionsSetup = this.optionsSetup;
        const title = {};
        title.text = optionsSetup.titleText;
        title.show = optionsSetup.isNoTitle;
        title.left = optionsSetup.textAlign;
        title.textStyle = {
          color: optionsSetup.textColor,
          fontSize: optionsSetup.textFontSize,
          fontWeight: optionsSetup.textFontWeight,
          fontStyle: optionsSetup.textFontStyle,
        };
        title.subtext = optionsSetup.subText;
        title.subtextStyle = {
          color: optionsSetup.subTextColor,
          fontWeight: optionsSetup.subTextFontWeight,
          fontSize: optionsSetup.subTextFontSize,
          fontStyle: optionsSetup.subTextFontStyle,
        };
        this.options.title = title;
      },
      // 数值设定
      setOptionsValue() {
        const optionsSetup = this.optionsSetup;
        const series = this.options.series;
        const numberValue = optionsSetup.numberValue ? "{c}" : "";
        const percentage = optionsSetup.percentage ? "({d})%" : "";
        const label = {
          show: optionsSetup.isShow,
          formatter: `{a|{b}：${numberValue} ${percentage}}`,
          rich: {
            a: {
              padding: [-30, 15, -20, 15],
              color: optionsSetup.subTextColor,
              fontSize: optionsSetup.fontSize,
              fontWeight: optionsSetup.fontWeight
            }
          },
          fontSize: optionsSetup.fontSize,

          fontWeight: optionsSetup.optionsSetup
        };
        for (const key in series) {
          if (series[key].type == "pie") {
            series[key].label = label;
            series[key].labelLine = {
              show: optionsSetup.isShow
            };
          }
        }
      },
      // 提示语设置 tooltip
      setOptionsTooltip() {
        const optionsSetup = this.optionsSetup;
        const tooltip = {
          trigger: "item",
          show: true,
          textStyle: {
            color: optionsSetup.lineColor,
            fontSize: optionsSetup.tipFontSize
          }
        };
        this.options.tooltip = tooltip;
      },
      // 图例操作 legend
      setOptionsLegend() {
        const optionsSetup = this.optionsSetup;
        const legend = this.options.legend;
        legend.show = optionsSetup.isShowLegend;
        legend.left = optionsSetup.lateralPosition == "left" ? 0 : "auto";
        legend.right = optionsSetup.lateralPosition == "right" ? 0 : "auto";
        legend.top = optionsSetup.longitudinalPosition == "top" ? 0 : "auto";
        legend.bottom =
          optionsSetup.longitudinalPosition == "bottom" ? 0 : "auto";
        legend.orient = optionsSetup.layoutFront;
        legend.textStyle = {
          color: optionsSetup.legendColor,
          fontSize: optionsSetup.legendFontSize
        };
        legend.itemWidth = optionsSetup.legendWidth;
      },
      // 图例颜色修改
      setOptionsColor() {
        const optionsSetup = this.optionsSetup;
        const customColor = optionsSetup.customColor;
        if (!customColor) return;
        const arrColor = [];
        for (let i = 0; i < customColor.length; i++) {
          arrColor.push(customColor[i].color);
        }
        this.options.color = arrColor;
        this.options = Object.assign({}, this.options);
      },
      setOptionsData() {
        const optionsData = this.optionsData; // 数据类型 静态 or 动态
        optionsData.dataType == this.staticDataFn(optionsData.staticData);
      },
      staticDataFn(val) {
        const staticData = typeof val == "string" ? JSON.parse(val) : val;
        for (const key in this.options.series) {
          if (this.options.series[key].type == "pie") {
            this.options.series[key].data = staticData;
          }
        }
        console.log("staticDataFn this.options=", this.options)
      },
    }
  }
</script>
