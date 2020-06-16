<template>
    <div id="bookManager">
      <!-- inline代表一行显示-->
      <el-form :inline="true">
        <el-form-item label="借阅人">
          <el-input v-model="searchdata.borrowPerson"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchdata.borrowStatus" placeholder="状态" clearable>
            <el-option label="未出借" value="1"></el-option>
            <el-option label="已出借" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="借阅时间">
          <el-date-picker
            v-model="borrowTime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitData">查询</el-button>
          <el-button type="primary" @click="showAdd">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData">
        <el-table-column prop="id" label="序号" width="140"></el-table-column>
        <el-table-column prop="name" label="书籍名称" width="120"></el-table-column>
        <el-table-column prop="borrowTime" label="借阅时间"></el-table-column>
        <el-table-column prop="returnTime" label="归还时间"></el-table-column>
        <el-table-column prop="borrowPerson" label="借阅人"></el-table-column>
        <el-table-column prop="borrowStatus" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.borrowStatus===1">未出借</span>
            <span v-if="scope.row.borrowStatus===2">已出借</span>
          </template>
        </el-table-column>
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
        :hide-on-single-page="true"
        layout="prev, pager, next"
        :page-size="searchdata.pageSize"
        :total="recordsTotal"
        @current-change="currentChange"
        >
      </el-pagination>
      <!-- 弹出层 新增图书 -->
      <el-dialog title="新增书籍" :visible.sync="dialogTableVisible" :before-close="closeForm" :close-on-click-modal="false">
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
          <el-form-item label="编号" prop="id">
            <el-input v-model="addForm.id"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="mark">
            <el-input type="textarea" v-model="addForm.mark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('addForm')">立即创建</el-button>
            <el-button @click="resetForm('addForm')">重置</el-button>
            <el-button @click="closeForm">关闭</el-button>
          </el-form-item>
        </el-form>
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
              pageSize: 10,
              borrowTimeStart: '',
              borrowTimeEnd: ''
            },
            borrowTime: [],
            pickerOptions: {
              shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [start, end]);
                }
              }]
            },
            addForm: {
              id: '',
              name: '',
              mark: ''
            },
            rules: {
              id: [
                { required: true, message: '请输入书籍编号', trigger: 'blur' },
              ],
              name: [
                { required: true, message: '请输入书籍名称', trigger: 'blur' },
                { min: 1, max: 50, message: '名称过长', trigger: 'blur' }
              ],
              date1: [
                { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
              ],
              date2: [
                { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
              ],
              type: [
                { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
              ],
              resource: [
                { required: true, message: '请选择活动资源', trigger: 'change' }
              ],
              desc: [
                { required: true, message: '请填写活动形式', trigger: 'blur' }
              ]
            }
          }
        },
        methods: {
          // 点击分页按钮
          currentChange (e) {
            this.searchdata.pageIndex = e
            this.getTableData()
          },
          // 关闭新增界面
          closeForm () {
              this.$refs['addForm'].resetFields();
              this.dialogTableVisible = false
              this.getTableData()
          },
          // 弹出新增页面
          showAdd () {
            // this.$refs['addForm'].resetFields(); 这一句不能加 因为没有这个变量
            this.dialogTableVisible = true
          },
          addBook () {
            const that = this
            axios.post("/api/bookManager/addBookManager",that.addForm)
              .then(res => {
                if (res.data.result === 'ok') {
                  that.$message({
                    message: '新增消息',
                    type: 'success'
                  });
                }else if(res.data.result === 'not_ok') {
                  this.$message.error(res.data.message);
                }
              })
              .catch(error => console.log(error))
          },
          submitForm(formName) {
            const that = this
            this.$refs[formName].validate((valid) => {
              if (valid) {
                that.addBook()
              } else {
                return false;
              }
            });
          },
          resetForm(formName) {
            this.$refs[formName].resetFields();
          },
          submitData () {
            const that = this
            if (that.borrowTime.length > 0) {
              that.searchdata.borrowTimeStart = that.borrowTime[0]
              that.searchdata.borrowTimeEnd = that.borrowTime[1]
            }
            console.log(that.searchdata)
            that.searchdata.pageIndex = 1
            that.getTableData()
          },
          handleClick (row) {
            console.log(row)
            this.dialogTableVisible = true
          },
          getTableData () {
            const that = this
            axios.post("/api/bookManager/getBookManagerList",that.searchdata)
              .then(res => {
                if (res.data.result === 'ok') {
                  that.tableData = res.data.data
                  that.recordsTotal = res.data.recordsTotal
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
