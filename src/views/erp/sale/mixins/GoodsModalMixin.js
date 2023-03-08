import { FormTypes, getListData } from '@/utils/JEditableTableUtil'
import { getAction,putAction } from '@/api/manage'
import { USER_INFO } from "@/store/mutation-types"
import Vue from 'vue'

export const GoodsModalMixin = {
  data() {
    return {
      action: '',
      taxPrice: '',
      isTenant: false,
      spans: {
        labelCol1: {span: 2},
        wrapperCol1: {span: 22},
        //1_5: 分为1.5列（相当于占了2/3）
        labelCol1_5: { span: 3 },
        wrapperCol1_5: { span: 21 },
        labelCol2: {span: 4},
        wrapperCol2: {span: 20},
        labelCol3: {span: 6},
        wrapperCol3: {span: 18},
        labelCol6: {span: 12},
        wrapperCol6: {span: 12}
      },
       url: {
         getbyid: "/goods/erpGoodsDto/queryByIds",
       },
       
    };
  },
  created () {
    let userInfo = Vue.ls.get(USER_INFO)
    this.isTenant = userInfo.id === userInfo.tenantId? true:false
    let realScreenWidth = window.screen.width * window.devicePixelRatio
    this.width = realScreenWidth<1600?'1300px':'1600px'
  },
  computed: {
    readOnly: function() {
      return this.action !== "add" && this.action !== "edit";
    }
  },
  methods: {
    /** 查询某个tab的数据 */
    requestSubTableData(url, params, tab, success) {
      tab.loading = true
      getAction(url, params).then(res => {
         console.log("requestSubTable res = ",res)
        if(res.success && res.code === 200){
          tab.dataSource = res.result;
          console.log("tab.dataSource = ",tab.dataSource)
          for(let i=0; i<tab.dataSource.length; i++){
            let info = tab.dataSource[i]
            this.changeColumnShow(info)
            if(info.goodsId != null) {
              this.changeAddedColumn(info)
            }
          }
          typeof success === 'function' ? success(res) : ''
        }
      }).finally(() => {
        tab.loading = false
      })
    },
    //编辑时，修改增加的列值，这里有商品编码，商品名称和总价等
    changeAddedColumn(info) { 
      let param = {
        ids: info.goodsId,
      }
      console.log("changeAddedColumn info",info)
      console.log("changeAddedColumn param",param)
      getAction(this.url.getbyid,param).then((res) => {
        console.log("onValueChange res",res)
        if (res && res.code === 200) {
          let mList = res.result;
          console.log("changeAddedColumn mList",mList)
          console.log("changeAddedColumn columns",this.erpSaleOutDetailTable.columns)
          this.$refs.erpSaleOutDetail.setValues([
            {
              rowKey: info.id, //行的id
                values: { //在这里values中的name是你columns中配置的key
                  'goodsCode': mList[0].code,
                  'goodsName': mList[0].name,
                  'totalPrice': info.orderNum*info.taxPrice.toFixed(2)-0,
              }
            },
          ])
        }
      })    
    },
      
    //使得商品名称，价格等为显示
    changeColumnShow(info) { 
      if(info.name) {
        this.changeFormTypes(this.erpSaleOutDetailTable.columns, 'goodsName', 1)
      }
      if(info.code) {
        this.changeFormTypes(this.erpSaleOutDetailTable.columns, 'goodsCode', 1)
      }
    },
    //改变字段的状态，1-显示 0-隐藏
    changeFormTypes(columns, key, type) {
      console.log("changeFormTypes columns key",columns,key);
      for(let i=0; i<columns.length; i++){
        if(columns[i].key === key) {
          if(type)
          {
            console.log("columns[i].key,key",columns[i].key,key)
            if (key === 'goodsId') {
              columns[i].type = FormTypes.popupGoods; //显示
              //columns[i].type = FormTypes.input; //显示
            }
            else if( (key === 'orderNum') || (key === 'taxPrice') || (key === 'totalPrice') ) 
            {
              columns[i].type = FormTypes.input; //显示
            }
            else
            {
              columns[i].type = FormTypes.normal;//显示
            }
          } else {
            columns[i].type = FormTypes.hidden; //隐藏
          }
        }
      }
    },
    //单元值改变一个字符就触发一次
    onValueChange(event) {
      console.log("onValueChange(event)");
      let that = this
      const { type, row, column, value, target } = event
      let param,orderNum,taxPrice,totalPrice
      switch(column.key) {
        case "goodsId":
          param = {
            ids: value,
          }
          console.log("onValueChange param",param)
          getAction(this.url.getbyid,param).then((res) => {
            console.log("onValueChange res",res)
            if (res && res.code === 200) {
              let mList = res.result;
              console.log("onValueChange mList,value",mList,value)
                this.$refs.erpSaleOutDetail.getValues((error, values) => {
                  values.pop()  //移除最后一行数据
                  let mArr = values
                  console.log("onValueChange mArr1",mArr)
                  console.log("onValueChange mList",mList)
                  for (let i = 0; i < mList.length; i++) {
                    let mInfo = mList[i]
                    console.log("onValueChange mList[i]",mList[i])
                    //this.changeColumnShow(mInfo)
                    let mObj = this.parseInfoToObj(mInfo)
                    console.log("onValueChange mObj",mObj)
                    mArr.push(mObj)
                  }
                  let totalPrice = 0
                  let totalNum = 0
                  for (let j = 0; j < mArr.length; j++) {
                    totalPrice += mArr[j].totalPrice-0
                    totalNum += mArr[j].orderNum-0
                  }
                  console.log("onValueChange mArr2",mArr)
                  this.erpSaleOutDetailTable.dataSource = mArr
                  target.statisticsColumns.totalPrice = totalPrice
                  target.statisticsColumns.orderNum = totalNum
                  this.model.totalAmount = totalPrice
                  this.model.totalNum = totalNum
                  //target.setValues(mArrValues)
                  //target.recalcAllStatisticsColumns()
                  // 更新form表单的值
                  //that.autoChangePrice(target) 
               })
            }  
          });
          break;
        case "orderNum":
          orderNum = value-0
          taxPrice = row.taxPrice-0 //单价
          totalPrice = (taxPrice*orderNum).toFixed(2)-0
          target.setValues([{rowKey: row.id, values: {totalPrice: totalPrice}}])
          target.recalcAllStatisticsColumns()
          that.autoChangePrice(target) 
          break;
        case "taxPrice":
          orderNum = row.orderNum-0 //数量
          taxPrice = value-0 //单价
          totalPrice = (taxPrice*orderNum).toFixed(2)-0
          target.setValues([{rowKey: row.id, values: {totalPrice: totalPrice}}])
          target.recalcAllStatisticsColumns()
          that.autoChangePrice(target) 
          break;
        case "totalPrice":
          orderNum = row.orderNum-0 //数量
          totalPrice = value-0
          taxPrice = (totalPrice/orderNum).toFixed(2)-0 //单价
          target.setValues([{rowKey: row.id, values: {taxPrice: taxPrice}}])
          target.recalcAllStatisticsColumns()
          that.autoChangePrice(target) 
          break;   
      }
    },
    
    //更新一些需要统计的值
    autoChangePrice(target) {
      let totalPrice = target.statisticsColumns.totalPrice-0
      let totalNum = target.statisticsColumns.orderNum-0
      this.model.totalAmount = totalPrice
      this.model.totalNum = totalNum
    },
  
    //使得型号、颜色、扩展信息、sku等为隐藏
    changeColumnHide() {
      //this.changeFormTypes(this.erpSaleOutDetailTable.columns, 'goodname', 0)
    },
    //转为商品对象
    parseInfoToObj(mInfo) {
      return {
        goodsId: mInfo.id,
        goodsCode: mInfo.code,
        goodsName: mInfo.name,
        orderNum: mInfo.num,
        oriPrice: mInfo.salePrice,
        taxPrice: mInfo.salePrice,
        discountRate: 100,
        isGift: 0,
        taxRate: 17,
        totalPrice: mInfo.totalPrice,
      }
    },
    //删除一行或多行的时候触发
    onDeleted(ids, target) {
      target.recalcAllStatisticsColumns()
    },
   }
}