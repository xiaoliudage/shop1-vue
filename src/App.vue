<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <el-menu 
      :default-active="2" 
      mode="horizontal" 
      background-color="#f8f9fa" 
      text-color="#333" 
      active-text-color="#409EFF"
    >
      <el-menu-item index="1">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="2">物品交换</el-menu-item>
      <el-menu-item index="3">我的发布</el-menu-item>
      <el-menu-item index="4">消息中心</el-menu-item>
      
      <el-menu-item index="5" style="margin-left: auto;">
        <el-button type="primary" icon="Plus">发布物品</el-button>
      </el-menu-item>
      <el-menu-item index="6">
        <el-avatar icon="User" size="small"></el-avatar>
      </el-menu-item>
    </el-menu>

    <!-- 搜索和分类区 -->
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="搜索物品名称或描述" prefix-icon="Search">
            <template #append>
              <el-button type="primary">搜索</el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="selectedCategory" placeholder="选择分类">
            <el-option 
              v-for="category in categories" 
              :key="category" 
              :label="category" 
              :value="category"
            />
          </el-select>
        </el-col>
      </el-row>
    </div>

    <!-- 物品列表区 -->
    <div class="main-content">
      <div class="items-grid">
        <el-row :gutter="20">
          <el-col 
            v-for="item in items" 
            :key="item.id"
            :xs="24" :sm="12" :md="8" :lg="6"
          >
            <el-card class="item-card">
              <img 
                :src="item.image" 
                class="item-image"
                @error="handleImageError"
              >
              <div class="card-body">
                <h3 class="item-title">{{ item.title }}</h3>
                
                <div class="item-description">
                  {{ item.description || '暂无描述' }}
                </div>
                
                <div class="item-meta">
                  <div class="price">
                    ¥{{ item.price?.toFixed(2) || '0.00' }}
                  </div>
                  
                  <div class="exchange-info">
                    <el-icon><Refresh /></el-icon>
                    <span>期望交换: {{ item.wantItems || '任意物品' }}</span>
                  </div>
                  
                  <div class="location-info">
                    <el-icon><Location /></el-icon>
                    <span>
                      位置: {{ formatLocation(item.latitude, item.longitude) }}
                    </span>
                  </div>
                </div>
                
                <div class="card-actions">
                  <el-button 
                    type="primary" 
                    size="small"
                    @click="viewDetail(item)"
                  >
                    查看详情
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 分页控件 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[8, 12, 16, 20]"
          :total="total"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { 
  House,
  Refresh,
  Location,
  Search,
  Plus,
  User 
} from '@element-plus/icons-vue'

// 分页相关变量
const currentPage = ref(1)
const pageSize = ref(8)
const total = ref(0)
const items = ref([])

// 分类选项
const categories = ref(['全部', '电子设备', '家具', '图书', '运动器材', '服饰'])
const selectedCategory = ref('全部')

// 获取物品列表数据
const fetchItems = async () => {
  try {
    console.log('正在请求数据 - 页码:', currentPage.value, '每页数量:', pageSize.value)
    const response = await axios.get('/shop/getAll', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value
      }
    })
    
    console.log('API响应数据:', response.data)
    const result = response.data
    
    items.value = (result.items?.records || []).map(item => ({
      ...item,
      id: item.itemId,
      image: item.imageUrl || `https://picsum.photos/200/200?random=${item.itemId}`
    }))
    
    total.value = result.items?.total || 0
    console.log('处理后的数据:', items.value, '总数量:', total.value)
  } catch (error) {
    console.error('获取物品数据失败:', error)
    console.error('错误详情:', error.response?.data || error.message)
    items.value = []
    total.value = 0
  }
}

// 分页事件处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1 // 重置到第一页
  fetchItems()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  fetchItems()
}

// 辅助函数
const formatLocation = (lat, lng) => {
  return `${lat?.toFixed(2) || '0.00'}, ${lng?.toFixed(2) || '0.00'}`
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/300x200'
}

const viewDetail = (item) => {
  console.log('查看详情:', item)
  // 实际项目中跳转到详情页
}

// 初始加载
onMounted(fetchItems)
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.search-bar {
  padding: 20px;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.items-grid {
  flex: 1;
}

.item-card {
  height: 100%;
  margin-bottom: 20px;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
}

.card-body {
  padding: 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-title {
  font-size: 16px;
  margin: 0 0 10px 0;
  color: #333;
  line-height: 1.4;
}

.item-description {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.item-meta {
  margin-top: auto;
}

.price {
  color: #ff4d4f;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
}

.exchange-info,
.location-info {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin: 6px 0;
  color: #666;
}

.exchange-info .el-icon {
  color: #409EFF;
  margin-right: 5px;
}

.location-info .el-icon {
  color: #909399;
  margin-right: 5px;
}

.card-actions {
  margin-top: 10px;
  text-align: right;
}

.pagination-wrapper {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
  text-align: center;
  margin-top: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .search-bar {
    padding: 15px;
  }
  
  .main-content {
    padding: 15px;
  }
  
  .item-card {
    margin-bottom: 15px;
  }
}
</style>