<template>
  <div class="item-details-container">
    <el-card class="item-details-card">
      <div class="item-header">
        <el-button @click="goBack" class="back-button">
          <el-icon><ArrowLeft /></el-icon> 返回列表
        </el-button>
        <h1 class="item-title">{{ item.title }}</h1>
      </div>

      <div class="item-content">
        <div class="item-image">
          <img :src="item.image" alt="{{ item.title }}" @error="handleImageError">
        </div>

        <div class="item-info">
          <div class="status-badge" :class="getStatusClass(item.status)">
            {{ getStatusText(item.status) }}
          </div>

          <div class="item-meta">
            <p><strong>价格:</strong> ¥{{ item.price?.toFixed(2) || '0.00' }}</p>
            <p><strong>期望交换:</strong> {{ item.wantItems || '任意物品' }}</p>
            <p><strong>位置:</strong> {{ formatLocation(item.latitude, item.longitude) }}</p>
          </div>

          <div class="item-description">
            <h3>商品描述</h3>
            <p>{{ item.description || '暂无描述' }}</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const item = ref({});
const loading = ref(true);

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

// 格式化位置信息
const formatLocation = (latitude, longitude) => {
  if (!latitude || !longitude) return '位置未知';
  return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
};

// 图片加载失败处理
const handleImageError = (e) => {
  e.target.src = '/placeholder-image.jpg'; // 替换为默认图片
};

// 返回列表页
const goBack = () => {
  router.push('/');
};

// 获取商品详情
const fetchItemDetails = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/shop/getById', {
      params: {
        itemId: route.params.itemId
      }
    });
    item.value = response.data;
  } catch (error) {
    console.error('获取商品详情失败:', error);
    ElMessage.error('获取商品详情失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchItemDetails();
});
</script>

<style scoped>
.item-details-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.item-details-card {
  padding: 20px;
}

.back-button {
  margin-bottom: 20px;
}

.item-header {
  margin-bottom: 30px;
}

.item-title {
  font-size: 24px;
  margin: 0;
}

.item-content {
  display: flex;
  gap: 30px;
}

.item-image {
  flex: 1;
  min-width: 300px;
}

.item-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

.item-info {
  flex: 2;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 16px;
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

.item-meta {
  margin-bottom: 20px;
  line-height: 1.6;
}

.item-description {
  background-color: #fafafa;
  padding: 16px;
  border-radius: 8px;
}

.item-description h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 18px;
}
</style>