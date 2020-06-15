<template>
    <div id="bookManager">
      <!-- inline代表一行显示-->
      <el-form :inline="true">
        <el-form-item label="借阅人">
          <el-input v-model="searchdata.borrowPerson" ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchdata.borrowStatus" placeholder="状态">
            <el-option label="未出借" value="1"></el-option>
            <el-option label="已出借" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData">
        <el-table-column prop="id" label="序号" width="140"></el-table-column>
        <el-table-column prop="name" label="书籍名称" width="120"></el-table-column>
        <el-table-column prop="borrowTime" label="借阅时间"></el-table-column>
        <el-table-column prop="returnTime" label="归还时间"></el-table-column>
        <el-table-column prop="borrowPerson" label="借阅人"></el-table-column>
        <el-table-column prop="borrowStatus" label="状态"></el-table-column>
        <el-table-column prop="mark" label="备注"></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
            <!-- 未归还的书籍不能删除 删除要有确定操作 -->
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="searchdata.pageSize"
        :total="recordsTotal">
      </el-pagination>

      <el-dialog title="书籍操作" :visible.sync="dialogTableVisible">
        <el-table>
          <el-table-column property="date" label="日期" width="150"></el-table-column>
          <el-table-column property="name" label="姓名" width="200"></el-table-column>
          <el-table-column property="address" label="地址"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "BookManager",
        data() {
          return {
            recordsTotal: undefined,
            tableData: [],
            dialogTableVisible: false,
            searchdata: {
              borrowPerson: '',
              borrowStatus: undefined,
              pageIndex: 1,
              pageSize: 20
            }
          }
        },
        methods: {
          handleClick (row) {
            console.log(row)
            this.dialogTableVisible = true
          },
          getTableData () {
            const that = this
            axios.post("/api/bookManager/getBookManagerList",that.searchdata)
              .then(res => {
                if (res.data.result === 'ok') {
                  debugger
                  this.tableData = res.data.data
                  this.recordsTotal = res.data.recordsTotal
                }
              })
              .catch(error => console.log(error))
          }
        },
        mounted() {
          this.getTableData()
        },

    }
</script>

<style scoped>

</style>
