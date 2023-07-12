<template>
  <el-dialog :z-index="1000" 
    class="tree_dialog"
    :title="titleBuild()"
    width="30%"
    :close-on-click-modal="false"
    center
    :visible.sync="visib"
    :before-close="closeDialog"
  >
    <div v-if="shareLinkFlag1">
      <el-form
        ref="userForm"
        :model="dialogForm"
        :rules="rules"
        size="small"
        label-width="100px"
      >
        <el-form-item label="有效期" prop="shareValidType">
          <j-dict-select-tag
            placeholder="请选择"
            dictCode="bs_share_vaild"
            v-model="dialogForm.shareValidType"
          />
        </el-form-item>
        <el-form-item label="分享码" prop="sharePasswordFlag">
          <el-switch v-model="dialogForm.sharePasswordFlag"> </el-switch>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        plain
        @click="createShare"
        style="margin-left:45px"
        >创建链接</el-button
      >
    </div>
    <div v-else>
      <el-form
        ref="userForm"
        :model="dialogForm"
        :rules="rules"
        size="small"
        label-width="100px"
      >
        <el-form-item label="链接" prop="reportShareUrl">
          <el-input v-model="reportShareUrl" :disabled="true" />
        </el-form-item>
        <el-form-item
          v-if="dialogForm.sharePasswordFlag"
          label="分享码"
          prop="sharePassword"
        >
          <el-input v-model="dialogForm.sharePassword" :disabled="true" />
        </el-form-item>

        <el-row :gutter="10">
          <el-button
            v-if="dialogForm.sharePassword == ''"
            type="primary"
            plain
            @click="copyShare"
            style="margin-left:45px"
            >复制链接</el-button
          >
          <el-button
            v-if="dialogForm.sharePassword != ''"
            type="primary"
            plain
            @click="copyShare"
            style="margin-left:45px"
            >复制链接和分享码</el-button
          >
        </el-row>
      </el-form>
    </div>

    <div slot="footer" style="text-align: center">
      <!--      <el-button type="primary" plain @click="saveReportShare">保存</el-button>-->
      <el-button type="danger" plain @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { reportShareAdd } from "@/api/bigscreen/reportShare";
import { excelShareAdd } from "@/api/bigscreen/reportShare";
export default {
  components: {  },
  props: {
    visib: {
      required: true,
      type: Boolean,
      default: false
    },
    reportCode: {
      required: true,
      type: String,
      default: () => {
        return "";
      }
    },
    reportName: {
      required: true,
      type: String,
      default: () => {
        return "";
      }
    },
    reportType: {
      required: true,
      type: String,
      default:() =>{
        return "";
      }
    }
  },
  data() {
    return {
      title: "报表分享",
      reportShareUrl: "",
      shareValidTypeOptions: [], // 有效期类型
      dialogForm: {
        shareValidType: 0,
        reportCode: "",
        reportType: "",
        shareUrl: "",
        shareCode: "",
        sharePassword: "",
        sharePasswordFlag: false
      },
      shareLinkFlag1: true,
      rules: {
        shareValidType: [
          { required: true, message: "有效期必选", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    visib(val) {
      if (val) {
        // 弹窗弹出时需要执行的逻辑
        
      }
    }
  },
  created() {},
  methods: {
    titleBuild() {
      return "【" + this.reportName + "】" + "报表分享";
    },
    selectChange(val) {
      this.dialogForm.shareValidType = val;
    },
    async createShare() {
      this.dialogForm.reportType = this.reportType;
      this.dialogForm.reportCode = this.reportCode;
      this.dialogForm.shareUrl = window.location.href;
      const urlType = this.reportType == '1' ? reportShareAdd(this.dialogForm) : excelShareAdd(this.dialogForm)
      const { code, result } = await urlType
      if (code != "200") return;
      this.shareLinkFlag1 = false;
      this.$message.success("创建链接成功！");
      this.reportShareUrl = result.shareUrl;
      this.dialogForm.sharePassword = result.sharePassword;
    },

    copyShare() {
      let content = "";
      if (this.dialogForm.sharePassword == "") {
        content = "BS-Report分享链接：" + this.reportShareUrl;
      } else {
        content =
          "BS-Report分享链接：" +
          this.reportShareUrl +
          "  分享码：" +
          this.dialogForm.sharePassword;
      }
      this.copyToClip(content);
      this.$message.success("复制链接成功！");
    },
    copyToClip(content, message) {
      let aux = document.createElement("input");
      aux.setAttribute("value", content);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);
    },

    async saveReportShare() {
      let params = {};
      this.closeDialog();
    },

    // 弹窗关闭之前需要执行的逻辑
    closeDialog() {
      this.$emit("handleClose");
    }
  }
};
</script>
