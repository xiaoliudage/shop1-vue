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
        <el-button type="primary" icon="Plus" @click="goToAddItem">发布物品</el-button>
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
              <!-- 添加状态标签 -->
              <div class="status-badge" :class="getStatusClass(item.status)">
                {{ getStatusText(item.status) }}
              </div>
              
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
                    @click="handleViewDetails(item.id)"
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
import { useRouter } from 'vue-router'
import { 
  House, Refresh, Location, Search, Plus, User 
} from '@element-plus/icons-vue'

const router = useRouter();

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

// 状态文本映射
const getStatusText = (status) => {
  const textMap = {
    1: '可交易',
    2: '交易中',
    3: '已交换'
  };
  return textMap[status] || '未知状态';
};

// 状态样式映射
const getStatusClass = (status) => {
  const classMap = {
    1: 'status-available',
    2: 'status-trading',
    3: 'status-exchanged'
  };
  return `status-badge ${classMap[status] || 'status-unknown'}`;
};

// 查看详情方法
const handleViewDetails = async (itemId) => {
  try {
    // 调用后端接口获取商品详情
    const response = await axios.get('/shop/getById', {
      params: {
        itemId: itemId  // 传递商品ID参数
      }
    });
    
    // 获取详情数据后跳转到详情页
    router.push({ name: 'ItemDetails', params: { itemId } });
  } catch (error) {
    console.error('获取商品详情失败:', error);
    ElMessage.error('获取商品详情失败，请稍后重试');
  }
};

onMounted(() => {
  fetchItems()
})
const goToAddItem = () => {
  router.push({ name: 'AddItem' })
}
</script>

<style scoped>
/* 原有样式保持不变 */
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-bar {
  margin: 20px 0;
}

.items-grid {
  margin-top: 20px;
}

.item-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.item-card:hover {
  transform: translateY(-5px);
}

.item-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.item-title {
  font-size: 18px;
  margin-bottom: 10px;
}

.item-description {
  color: #666;
  margin-bottom: 16px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  margin-bottom: 16px;
}

.price {
  font-size: 18px;
  color: #f56c6c;
  margin-bottom: 8px;
}

.exchange-info, .location-info {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

.exchange-info el-icon,
.location-info el-icon {
  margin-right: 4px;
}

.pagination-wrapper {
  margin-top: 30px;
  text-align: center;
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-available {
  background-color: #f0f9eb;
  color: #52c41a;
}

.status-trading {
  background-color: #fffbe6;
  color: #faad14;
}

.status-exchanged {
  background-color: #f5f5f5;
  color: #8c8c8c;
}
</style>