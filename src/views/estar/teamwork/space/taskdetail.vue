<template>
  <a-modal class="task-detail-modal" width="min-content" :closable="false" visible title="" :footer="null"
    @cancel="detailClose">
    <task-detail :taskId="id" @close="detailClose"></task-detail>

  </a-modal>
</template>

<script>
  import taskDetail from '../components/taskDetail'

  export default {
    name: "task-detail-modal",
    components: {
      taskDetail
    },
    data() {
      return {
        loading: false,
        id: this.$route.params.taskId,
        projectId: this.$route.params.id,
      }
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        this.loading = true;
      },
      detailClose() {
        const stageIndex = this.$route.query.from;
        let url = '';
        if (stageIndex) {
          url = `?from=${stageIndex}`;
        }
        this.$router.push(`/estar/teamwork/space/task/${this.projectId}${url}`);
      },
    }
  }
</script>


<style lang="less">
  .task-detail-modal {
    display: flex;
    justify-content: center;
    flex: 1;
    min-height: 1px;
    min-width: 1px;
    width: 1200px;

    &.ant-modal {
      padding-bottom: 0;
    }

    .ant-modal-content {
      width: 1200px;
      overflow: hidden;

      .ant-modal-body {
        padding: 0;
      }

    }
  }
</style>