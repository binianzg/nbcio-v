<template>
  <div>
    <a-modal class="add-project-member" :width="500" v-model="actionInfo.modalStatus" :title="actionInfo.modalTitle"
      :footer="null" @cancel="cancel">
      <div class="header"><span> </span>

      </div>
      <div class="search-content m-b">
        <a-input v-model="keyword" placeholder="输入昵称查找">
          <a-icon slot="prefix" type="search" />
        </a-input>
      </div>
      <vue-scroll>
        <div class="member-list">
          <a-list class="project-list" itemLayout="horizontal" :loading="searching" :dataSource="list"
            :locale="{emptyText: (keyword && keyword.length > 1) ? '没有搜索到相关成员' : ''}">
            <a-list-item slot="renderItem" slot-scope="item">
              <span slot="actions">
                <a-button size="small" type="dashed" icon="user-add" v-if="!item.joined"
                  @click="add(item)">添加</a-button>
                <template v-else>
                  <a-icon type="user"></a-icon>
                  <span> 已加入</span>
                </template>
              </span>
              <a-list-item-meta :description="item.email">
                <span slot="title">{{item.name}}</span>
                <a-avatar slot="avatar" icon="user" :src="item.avatar" />
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </div>
      </vue-scroll>
    </a-modal>
  </div>

</template>

<script>
  import moment from 'moment';
  import {
    addMember,
    searchMember,
    listForAdd
  } from "@/api/teamwork/member";


  export default {
    name: "addProjectMember",
    props: {
      value: {
        type: Boolean,
        default () {
          return false
        }
      },
      projectId: {
        type: [String],
        default () {
          return ''
        }
      },
      organizationId: {
        type: [String],
        default () {
          return ''
        }
      }
    },
    data() {
      return {
        form: this.$form.createForm(this),
        actionInfo: {
          modalStatus: this.value,
          confirmLoading: false,
          modalTitle: '添加新成员',
        },
        linkInfo: {
          modalStatus: false,
          confirmLoading: false,
          modalTitle: '添加成员',
          link: '',
          overTime: '',
        },
        keyword: '',
        searching: false,
        list: [],
      };
    },
    watch: {
      value(value) {
        this.actionInfo.modalStatus = value;
      },
      keyword() {
        this.search();
      }
    },
    created() {
      this.getMembers();
    },
    methods: {
      getMembers() {
        let that = this;
        let params = {
          projectId: that.projectId,
          organizationId: that.organizationId
        }
        listForAdd(params).then(res => {
          that.list = res.result;
        });
      },
      add(item) {
        let params = {
          projectId: this.projectId,
          userId: item.userId
        }
        addMember(params).then((res) => {
          if (res.success) {
            item.joined = true;
          }
        })
      },
      search: function() {
        if (!this.keyword) {
          this.list = [];
        }

        this.searching = true;
        let params = {
          projectId: this.projectId,
          organizationId: this.organizationId,
          keyword: this.keyword
        }
        searchMember(params).then(res => {
          this.searching = false;
          this.list = res.result;
        });
      },
      cancel() {
        this.actionInfo.modalStatus = false;
        this.$emit('input', this.actionInfo.modalStatus);
      }
    }
  }
</script>

<style lang="less">
  .add-project-member {
    .ant-modal-body {
      padding-top: 0;
      padding-right: 12px;
      padding-bottom: 24px;
      min-height: 40vh;
    }

    .header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 12px 0;
    }

    .member-list {
      padding-right: 12px;
      max-height: 400px;
    }

  }
</style>