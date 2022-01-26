<template>
  <div class="table-v">
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      empty-text="暂无数据"
      :max-height="tableHeight"
      @row-dblclick="selectRow"
    >
      <el-table-column
        prop="departDate"
        label="发车日期"
        align="center"
        width="200"
      >
      </el-table-column>
      <el-table-column prop="trainNo" label="车次号" align="center" width="180">
      </el-table-column>
      <el-table-column prop="departStation" label="出发站" align="center">
      </el-table-column>
      <el-table-column prop="arrivalStation" label="到达站" align="center">
      </el-table-column>
      <el-table-column prop="seatClass" label="席别" align="center">
      </el-table-column>
      <el-table-column prop="sumTicketQuantity" label="数量" align="center">
      </el-table-column>
      <el-table-column prop="state" label="状态" align="center">
        <template #default="scope">
          <div v-if="scope.row.state === 0" class="status0">待出票</div>
          <div v-if="scope.row.state === 1" class="status1">已完成</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "TicketTable",
  props: {
    tableData: {
      default: () => [],
      // [
      //   { name: '继续拍摄', type: 0 },
      //   { name: '提交出票信息', type: 1 }
      // ]
      type: Array,
    },
  },
  data() {
    return {
      tableHeight: document.documentElement.clientHeight - 72,
    };
  },
  methods: {
    selectRow(row) {
      let trainGroupIds = [];
      this.tableData.map((i) => {
        trainGroupIds.push(i.trainGroupId);
      });
      this.$router.push({
        path: "/lssue_tickets",
        query: {
          trainGroupIds,
          trainGroupIdsQuery: row.trainGroupId,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.table-v {
  width: 100%;
  box-sizing: border-box;
  padding: 0 52px;
  background-color: white;
  ::v-deep(.el-table) {
    th {
      border-bottom: 1px solid #e2e2e2;
      padding: 32px 0;
      .cell {
        font-weight: 500;
        font-size: 36px;
        line-height: 50px;
        color: #bbbbbb;
      }
    }
    td {
      padding: 56px 0;
      border-bottom: 1px solid #e2e2e2;
    }

    .el-table__row--striped {
      td {
        background-color: #f8f9fd;
      }
    }
    tr:hover > td {
      background-color: #ebf8f4;
    }
    .disable-col {
      .cell {
        color: #ccc !important;
      }
    }
  }
  .status {
    font-size: 34px;
  }
  .status0 {
    color: #ff6767;
  }
  .status1 {
    color: #62cba7;
  }
}
</style>
