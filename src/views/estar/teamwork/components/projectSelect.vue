<template>
  <div id="project-select" v-if="currentProject">
    <a-dropdown :trigger="['click']" v-model="visibleMenu" class="action-item" placement="bottomCenter">
      <a-tooltip :mouseEnterDelay="0.3" :title="currentProject.name">
        <a class="project-select" style="color: #333" @click="opens">
          <span>{{currentProject.name}}</span>
          <span class="m-l-xs"><a-icon type="down" /></span>
        </a>
      </a-tooltip>
      <div slot="overlay" class="middle-menu member-menu project-select-menu">
        <div class="search-content">
          <a-input v-model="keyword" size="large" placeholder="搜索">
            <a-icon slot="prefix" type="search" />
          </a-input>
        </div>
        <div class="member-list">
          <vue-scroll>
            <div class="list-group">
              <a-list class="list-content" itemLayout="horizontal" :dataSource="projectList"
                :locale="{emptyText: (keyword && keyword.length > 1) ? '没有找到该项目' : ''}">
                <a-list-item class="member-list-item" slot="renderItem" slot-scope="item"
                  @click.native="changeProject(item.id)">
                  <span slot="actions">
                    <a-icon type="check" v-show="showCheck(item.id)"></a-icon>
                  </span>
                  <a-list-item-meta>
                    <span slot="title">{{item.name}}</span>
                    <a-avatar slot="avatar" icon="user" :src="item.cover" />
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </div>
          </vue-scroll>
        </div>
      </div>
    </a-dropdown>
  </div>
</template>

<script>
  import _ from 'lodash'
  import {
    mapState
  } from 'vuex'
  import {
    prejectset as getProject,
    selfList as getProjectList
  } from "@/api/teamwork/project";
  import pagination from "../mixins/pagination";

  export default {
    name: 'ProjectSelect',
    props: {
      id: {
        type: [String],
        default () {
          return ''
        }
      },
    },
    data() {
      return {
        visibleMenu: false,
        keyword: '',
        loading: false,
        currentProject: null,
        projectList: [],
        projectListCopy: [],
        projectTotal: 0,
        open: false
      }
    },
    mixins: [pagination],
    computed: {
      ...mapState({
        currentOrganization: state => state.currentOrganization,
        organizationList: state => state.organizationList
      })
    },
    watch: {
      id() {
        this.init();
      },
      keyword() {
        this.search();
      },

    },
    created() {
      this.init();
    },
    methods: {
      init() {
        this.getProject();
        this.getProjectList(true);
      },
      opens() {

        if (this.visibleMenu) {
          this.open = false
          this.visibleMenu = true
        } else {
          this.open = false
          this.visibleMenu = false
        }
      },
      getProject() {
        console.log("getProject id", this.id);
        getProject({
          id: this.id
        }).then((res) => {
          console.log("getProject res", res);
          this.currentProject = res.result;
        });
      },
      getProjectList(loading = true) {
        this.loading = loading;
        this.requestData.pageSize = 50;
        this.requestData.archive = -1;
        getProjectList(this.requestData).then(res => {
          console.log("getProjectList res", res);
          this.projectList = res.result.records;
          this.projectListCopy = res.result.records;
          this.projectTotal = res.total;
          this.loading = false;
        });
      },
      changeProject(id) {
        this.visibleMenu = false;
        this.$router.push('/estar/teamwork/space/task/' + id);
      },
      showCheck(id) {
        if (id == this.id) {
          return true;
        }
      },
      search: _.debounce(
        function() {
          this.keyword = this.keyword.trim();
          if (!this.keyword) {
            this.projectList = JSON.parse(JSON.stringify(this.projectListCopy));
          }
          if (this.keyword.length <= 1) {
            //return false;
          }
          // this.searching = true;
          this.projectList = this.projectList.filter(item => item.name.indexOf(this.keyword) != -1);
        }, 500
      ),
      getPopup() {
        return document.getElementById('project-select');
      },
    }
  }
</script>

<style lang="less">
  #project-select {
    cursor: pointer;

    :hover {
      /*background: rgba(0, 0, 0, 0.025);*/
    }
  }

  .project-select-menu {
    margin-left: 10px;

    .member-list {
      height: 290px;
    }
  }
</style>