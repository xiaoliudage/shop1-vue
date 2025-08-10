<template>
  <router-view />
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

// 添加状态文本映射
const getStatusText = (status) => {
  const statusMap = {
    1: '可交换',
    2: '交易中',
    3: '已交换'
  }
  return statusMap[status] || '未知状态'
}

// 添加状态样式映射
const getStatusClass = (status) => {
  const classMap = {
    1: 'status-available',
    2: 'status-trading',
    3: 'status-exchanged'
  }
  return `status-badge ${classMap[status] || 'status-unknown'}`
}


// 添加查看详情方法
const handleViewDetails = async (itemId) => {
  try {
    // 调用后端接口获取商品详情
    const response = await axios.get('/shop/getById', {
      params: {
        itemId: itemId  // 传递商品ID参数
      }
    });
    
    // 获取详情数据后的处理逻辑
    const itemDetails = response.data;
    console.log('商品详情:', itemDetails);
    
    // 这里可以添加打开详情模态框或跳转到详情页的逻辑
    // 例如: openDetailDialog(itemDetails);
  } catch (error) {
    console.error('获取商品详情失败:', error);
    // 错误处理，如显示错误提示
    ElMessage.error('获取商品详情失败，请稍后重试');
  }
};
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

/* 添加状态标签样式 */
.status-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  z-index: 1;
}

.status-available {
  background-color: #4CAF50; /* 绿色-可交换 */
}

.status-trading {
  background-color: #FF9800; /* 橙色-交易中 */
}

.status-exchanged {
  background-color: #F44336; /* 红色-已交换 */
}

.status-unknown {
  background-color: #9E9E9E; /* 灰色-未知状态 */
}

/* 调整卡片样式以适应状态标签 */
.item-card {
  position: relative;
  overflow: hidden;
}
</style>