<template>
    <div id="book">
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
      <!-- highlight-current-row表示点击当前行的时候选中状态 -->
      <el-table :data="tableData" :highlight-current-row="true" >
        <el-table-column prop="id" label="序号" width="140"></el-table-column>
        <el-table-column prop="name" label="书籍名称" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="borrowTime" label="借阅时间"></el-table-column>
        <el-table-column prop="returnTime" label="归还时间"></el-table-column>
        <el-table-column prop="borrowPerson" label="借阅人"></el-table-column>
        <el-table-column prop="borrowStatus" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.borrowStatus===1">未出借</span>
            <span v-if="scope.row.borrowStatus===2">已出借</span>
          </template>
        </el-table-column>
        <el-table-column prop="mark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <!--
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            -->
            <el-button @click="showEdit(scope.row)" type="text" size="small">编辑</el-button>
            <!-- 未归还的书籍不能删除 删除要有确定操作 -->
            <el-button type="text" size="small" @click="deleteTableData(scope.row)">删除</el-button>
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
            <el-input v-model="addForm.id" maxlength="10"></el-input>
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
      <!-- 弹出层 编辑图书 -->
      <el-dialog title="编辑书籍" :visible.sync="editBookVisible" :before-close="closeEditForm" :close-on-click-modal="false">
        <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px">
          <el-form-item label="编号" prop="id">
            <el-input v-model="editForm.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="借阅人" prop="borrowPerson" v-if="editForm.borrowStatus === '2'">
            <el-input v-model="editForm.borrowPerson"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="borrowStatus">
            <el-select v-model="editForm.borrowStatus" placeholder="状态">
              <el-option label="未出借" value="1"></el-option>
              <el-option label="已出借" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="借阅时间" prop="borrowTime" v-if="editForm.borrowStatus === '2'">
            <el-date-picker
              v-model="editForm.borrowTime"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptionsForEditBorrow">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="归还时间" prop="returnTime" v-if="editForm.borrowStatus === '2'">
            <el-date-picker
              v-model="editForm.returnTime"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptionsForEditReturn">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注" prop="mark">
            <el-input type="textarea" v-model="editForm.mark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitEditForm('editForm')">保存</el-button>
            <el-button @click="closeEditForm">关闭</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
    import api from '../api/api'
    export default {
        name: "Book",
        data() {
          return {
            recordsTotal: undefined,
            tableData: [],
            dialogTableVisible: false,
            editBookVisible: false,
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
            pickerOptionsForEditBorrow: {
              /*disabledDate(time) {
                return time.getTime() > Date.now();
              },*/
              shortcuts: [{
                text: '今天',
                onClick(picker) {
                  picker.$emit('pick', new Date());
                }
              }, {
                text: '昨天',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24);
                  picker.$emit('pick', date);
                }
              }]
            },
            pickerOptionsForEditReturn: {
              /*disabledDate(time) {
                return time.getTime() > Date.now();
              },*/
              shortcuts: [{
                text: '明天',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() + 3600 * 1000 * 24);
                  picker.$emit('pick', date);
                }
              }]
            },
            addForm: {
              id: '',
              name: '',
              mark: ''
            },
            editForm: {
              id: '',
              name: '',
              mark: '',
              borrowStatus: '',
              borrowPerson: '',
              borrowTime: '',
              returnTime: ''
            },
            rules: {
              id: [
                { required: true, message: '请输入书籍编号', trigger: 'blur' },
              ],
              name: [
                { required: true, message: '请输入书籍名称', trigger: 'blur' },
                { min: 1, max: 50, message: '名称过长', trigger: 'blur' }
              ],
              borrowPerson: [
                { required: true, message: '请填写借阅人', trigger: 'blur' }
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
          deleteTableData (row) {
            const that = this
            that.$confirm('永久删除书籍, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                const params = {
                  id:row.id
                }
                api.deleteBook(params)
                .then(res => {
                  if (res.data.result === 'ok') {
                    that.$message({
                      message: '删除成功',
                      type: 'success',
                      onClose: function (msg) {
                        that.searchdata.pageIndex = 1
                        that.getTableData()
                      }
                    })
                  }else if(res.data.result === 'not_ok') {
                    that.$message.error(res.data.message)
                  }
                })
                .catch(error => console.log(error))
            }).catch(() => {
              that.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          },
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
          // 关闭编辑界面
          closeEditForm () {
            this.editBookVisible = false
          },
          // 弹出新增页面
          showAdd () {
            // this.$refs['addForm'].resetFields(); 这一句不能加 因为没有这个变量
            this.dialogTableVisible = true
          },
          showEdit (row) {
            debugger
            this.editForm.id = row.id
            this.editForm.name = row.name
            this.editForm.mark = row.mark
            this.editForm.borrowPerson = row.borrowPerson
            console.log(typeof(row.borrowStatus)) // number类型
            this.editForm.borrowStatus = row.borrowStatus.toString() // 这里是个大坑 项目中也经常遇到, 如果类型和选择下拉框类型不符合，弹出的编辑界面下拉框是不会赋值的
            this.editForm.borrowTime = row.borrowTime
            this.editForm.returnTime = row.returnTime
            this.editBookVisible = true
          },
          addBook () {
            const that = this
            api.addBook(that.addForm)
              .then(res => {
                if (res.data.result === 'ok') {
                  that.$message({
                    message: '新增成功',
                    type: 'success'
                  });
                }else if(res.data.result === 'not_ok') {
                  that.$message.error(res.data.message);
                }
              })
              .catch(error => console.log(error))
          },
          editBook () {
            const that = this
            const borrowTime = that.editForm.borrowTime
            const returnTime = that.editForm.returnTime
            const borrowStatus = that.editForm.borrowStatus
            if(borrowStatus === '1'){// 未出借
              that.editForm.borrowTime = ''
              that.editForm.returnTime = ''
              that.editForm.borrowPerson = ''
            }else{// 已出借
              if(borrowTime == null || borrowTime == ''){
                that.$message({
                  message: '请填写出借时间',
                  type: 'error'
                })
                return
              }
              if(returnTime != null && returnTime != '') {
                const t1 = new Date(returnTime)
                const t2 = new Date(borrowTime)
                if(t1.getTime() < t2.getTime()) {
                  that.$message({
                    message: '出借时间大于归还时间',
                    type: 'error'
                  })
                  return
                }
              }
            }
            api.updateBook(that.editForm)
              .then(res => {
                if (res.data.result === 'ok') {
                  that.$message({
                    message: '更新成功',
                    type: 'success'
                  })
                  that.editBookVisible = false
                  that.getTableData()
                }else if(res.data.result === 'not_ok') {
                  this.$message.error(res.data.message)
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
          submitEditForm(formName) {
            const that = this
            this.$refs[formName].validate((valid) => {
              if (valid) {
                that.editBook()
              } else {
                return false;
              }
            });
          },
          submitData () {
            const that = this
            if (that.borrowTime && that.borrowTime.length > 0) {
              that.searchdata.borrowTimeStart = that.borrowTime[0]
              that.searchdata.borrowTimeEnd = that.borrowTime[1]
            }else {
              that.searchdata.borrowTimeStart = ''
              that.searchdata.borrowTimeEnd = ''
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
            api.getBookList(that.searchdata)
              .then(res => {
                console.log(res)
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
