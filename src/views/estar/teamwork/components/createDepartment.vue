<template>
  <div class="create-department member-menu">
    <div class="header">
      {{actionType}}{{actionTitle}}
    </div>
    <div class="search-content">
      <a-input v-model="name" size="large" :placeholder="`${actionTitle}名称`">
        <a-icon slot="prefix" type="bulb" class="muted" />
      </a-input>
      <div class="info" v-if="parentDepartmentId">
        <span class="muted">隶属于：{{parentDepartment.name}}</span>
      </div>
    </div>
    <div class="actions">
      <a-button type="primary" class="middle-btn" size="large" block :loading="loading" :disabled="disabled || loading"
        @click="doAction" @pressEnter="doAction">{{actionType}}
      </a-button>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  //import {doData, read} from "../../api/department";
  import {
    checkResponse
  } from "@/assets/tw/js/utils";
  import {
    notice
  } from "@/assets/tw/js/notice";

  export default {
    name: "createDepartment",
    props: {
      departmentId: {
        type: [String, Boolean],
        default () {
          return ''
        }
      },
      parentDepartmentId: {
        type: [String, Boolean],
        default () {
          return ''
        }
      },
    },
    data() {
      return {
        name: '',
        loading: false,
        department: {},
        parentDepartment: {}
      };
    },
    computed: {
      actionType() {
        return this.departmentId ? '编辑' : '创建'
      },
      actionTitle() {
        return this.parentDepartmentId ? '子部门' : '部门'
      },
      disabled() {
        return !this.name.trim()
      },
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        if (this.departmentId) {
          read(this.departmentId).then(res => {
            this.department = res.result;
            this.name = res.result.name;
          });
        }
        if (this.parentDepartmentId) {
          read(this.parentDepartmentId).then(res => {
            this.parentDepartment = res.result
          });
        }
      },
      doAction() {
        this.name = this.name.trim();
        if (!this.name) {
          return false;
        }
        const obj = {
          departmentId: this.departmentId,
          parentDepartmentId: this.parentDepartmentId,
          name: this.name
        };
        this.loading = true;
        doData(obj).then(res => {
          this.loading = false;
          if (!checkResponse(res)) {
            return false;
          }
          notice({
            title: `${this.actionType}部门成功`
          }, 'notice', 'success');
          this.$emit('update', res.result);
          if (this.departmentId) {
            this.$emit('edit', this.name)
          }
        });
      },
    }
  }
</script>
<style lang="less">
  .create-department {

    &.member-menu {
      height: auto;

      .header {
        padding: 0 12px 12px 6px;
        justify-content: center;
        font-weight: bold;
        border-bottom: 1px solid #e8e8e8;
      }

      .search-content {
        padding-top: 18px;
      }

      .info {
        padding: 12px 0 0 0;
      }

      .actions {
        padding: 0px 12px;
      }

    }
  }
</style>