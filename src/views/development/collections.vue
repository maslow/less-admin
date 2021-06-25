<template>
  <div class="app-container">
    <div class="collec-wrap">
      <div class="filter-container">
        <el-select v-model="collectionName" filterable placeholder="请选择集合">
          <el-option
            v-for="item in collections"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>

      <el-container style="height: 800px; border: 1px solid #eee">
        <el-aside width="340px" style="background-color: rgb(238, 241, 246)">
          <div v-for="item in list" :key="item._id" class="collec-item" @click="getValue(item)">_id: {{ item._id }}</div>

          <!-- 分页 -->
          <!-- <pagination
            v-show="total>0"
            style="width: 320px;"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getList"
          /> -->
        </el-aside>

        <el-container>
          <el-header style="text-align: right; font-size: 12px">
            <span>记录</span>
          </el-header>

          <el-main>
            <json-editor v-model="value" :dark="true" :height="660" />
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import { db } from '@/api/cloud'
import { getCollections } from '@/api/collec'

// import Pagination from '@/components/Pagination'
import JsonEditor from './components/JsonEditor/rule'

// const

export default {
  name: 'CollectionManagement',
  components: { JsonEditor },
  directives: {},
  filters: {},
  data() {
    return {
      collections: [],
      collectionName: '',
      listQuery: {
        limit: 10,
        page: 1
      },
      list: [],
      total: 0,
      value: {
        'read': "$has('admin.read')",
        'update': "$has('admin.edit')",
        'add': "$has('admin.create')",
        'remove': "$has('admin.delete')"
      }
    }
  },
  watch: {
    collectionName(val) {
      if (val) {
        console.log('collectionName change')
        this.getList()
      }
    }
  },
  async created() {
    await this.getCollections()
  },
  methods: {
    async getCollections() {
      const ret = await getCollections()

      this.collections = ret || []
    },

    async getList() {
      const collectionName = this.collectionName || ''
      const { limit, page } = this.listQuery

      // 执行数据查询
      const res = await db.collection(collectionName)
        .limit(limit)
        .skip((page - 1) * limit)
        .get()

      this.list = res.data

      // 获取数据总数
      const { total } = await db.collection(collectionName)
        .limit(limit)
        .skip((page - 1) * limit)
        .count()

      this.total = total
    },

    getValue(val) {
      this.value = val
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
    .collec-item {
      padding: 10px 0;
      margin: 2px 0;
      cursor:pointer;
      // background: #f2f2f2;
    }
  }

</style>
