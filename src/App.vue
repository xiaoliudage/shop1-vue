<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 分页相关变量
const currentPage = ref(1);
const pageSize = ref(10); // 默认每页10条
const total = ref(0);
const items = ref([]);

// 分类选项
const categories = ref(['全部', '电子设备', '家具', '图书', '运动器材', '服饰']);
const selectedCategory = ref('全部');

// 获取物品列表数据
const fetchItems = async () => {
  try {
      console.log('正在请求数据 - 页码:', currentPage.value, '每页数量:', pageSize.value);
      const response = await axios.get('/shop/getAll', {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value // 使用响应式的pageSize
        }
      });
      console.log('API响应数据:', response.data);
      const result = response.data;
      // 从分页对象中获取实际数据数组（IPage.records）
      const itemsArray = Array.isArray(result.items?.records) ? result.items.records : [];
      items.value = itemsArray.map(item => ({
        ...item,
        id: item.itemId,
        image: item.imageUrl || `https://picsum.photos/200/200?random=${item.itemId}`
      }))
      // 使用分页对象中的total属性
      total.value = result.items?.total || 0;
      console.log('处理后的数据 - 物品列表:', items.value, '总数量:', total.value);
    } catch (error) {
      console.error('获取物品数据失败:', error);
      console.error('错误详情:', error.response?.data || error.message);
      // 显示错误提示
      items.value = [];
      total.value = 0;
    }
};

// 初始加载第一页数据
onMounted(fetchItems);
</script>

<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <el-menu :default-active="2" mode="horizontal" background-color="#f8f9fa" text-color="#333" active-text-color="#409EFF">
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
    <div class="search-bar" style="padding: 20px; background-color: #f5f5f5;">
      <el-row gutter="20">
        <el-col :span="8">
          <el-input placeholder="搜索物品名称或描述" prefix-icon="Search">
            <template #append>
              <el-button type="primary">搜索</el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="selectedCategory" placeholder="选择分类">
            <el-option v-for="category in categories" :key="category" :label="category" :value="category"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>

    <!-- 物品列表区 -->
    <div class="items-container" style="padding: 20px;">
      
      <el-row gutter="20">
        <el-col :span="6" v-for="item in items" :key="item.id">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="item.image" class="item-image" style="width: 100%; height: 180px; object-fit: cover;">
            <div style="padding: 14px;">
              <h3 style="font-size: 16px; margin-bottom: 10px;">{{ item.title }}</h3>
              
              <!-- 新增描述信息 -->
              <div style="margin-bottom: 8px; font-size: 13px; color: #606266; height: 40px; overflow: hidden; text-overflow: ellipsis;">
                {{ item.description }}
              </div>
              
              <div class="item-info" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span class="price" style="color: #ff4d4f; font-weight: bold;">¥{{ item.price }}</span>
              </div>
              
              <!-- 新增交换需求 -->
              <div style="font-size: 12px; margin-bottom: 10px; display: flex; align-items: center;">
                <el-icon style="margin-right: 4px; color: #409EFF;"><Refresh /></el-icon>
                <span style="color: #606266;">期望交换: {{ item.wantItems }}</span>
              </div>
              
              <!-- 新增位置信息 -->
              <div style="font-size: 12px; color: #909399; margin-bottom: 10px; display: flex; align-items: center;">
                <el-icon style="margin-right: 4px;"><MapLocation /></el-icon>
                <span>位置: {{ item.latitude.toFixed(2) }}, {{ item.longitude.toFixed(2) }}</span>
              </div>
              
              <div style="margin-top: 10px; text-align: right;">
                <el-button size="small" type="text">查看详情</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 分页控件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
// 分页相关响应式变量
const currentPage = ref(1);
const pageSize = ref(10); // 默认每页10条
const total = ref(0);

// 分页事件处理函数
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // 切换每页条数时重置到第一页
  fetchItems();
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  fetchItems();
};

const fetchItems = async () => {
  try {
      console.log('正在请求数据 - 页码:', currentPage.value, '每页数量:', pageSize.value);
      const response = await axios.get('/shop/getAll', {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value // 使用响应式的pageSize
        }
      });
      console.log('API响应数据:', response.data);
      const result = response.data;
      // 从分页对象中获取实际数据数组（IPage.records）
      const itemsArray = Array.isArray(result.items?.records) ? result.items.records : [];
      items.value = itemsArray.map(item => ({
        ...item,
        id: item.itemId,
        image: item.imageUrl || `https://picsum.photos/200/200?random=${item.itemId}`
      }))
      // 使用分页对象中的total属性
      total.value = result.items?.total || 0;
      console.log('处理后的数据 - 物品列表:', items.value, '总数量:', total.value);
    } catch (error) {
      console.error('获取物品数据失败:', error);
      console.error('错误详情:', error.response?.data || error.message);
      // 显示错误提示
      items.value = [];
      total.value = 0;
    }
};
</script>

<style scoped>
/* 可以添加自定义样式 */
.pagination-container {
  margin-top: 20px;
  text-align: center;
}

.items-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}
</style>