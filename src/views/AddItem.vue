<template>
  <div class="add-item-container">
    <el-card class="add-item-card">
      <h2>发布新物品</h2>
      <el-form ref="itemForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="物品标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入物品标题"></el-input>
        </el-form-item>
        <el-form-item label="物品描述" prop="description">
          <el-input type="textarea" v-model="formData.description" placeholder="请输入物品描述" rows="4"></el-input>
        </el-form-item>
        <el-form-item label="物品价格" prop="price">
          <el-input v-model.number="formData.price" placeholder="请输入物品价格"></el-input>
        </el-form-item>
        <el-form-item label="期望交换" prop="wantItems">
          <el-input v-model="formData.wantItems" placeholder="请输入期望交换的物品"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model.number="formData.latitude" placeholder="请输入纬度"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model.number="formData.longitude" placeholder="请输入经度"></el-input>
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model.number="formData.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const router = useRouter();
const itemForm = ref(null);

const formData = reactive({
  title: '',
  description: '',
  price: null,
  wantItems: '',
  latitude: null,
  longitude: null,
  userId: null
});

const rules = {
  title: [{ required: true, message: '请输入物品标题', trigger: 'blur' }],
  price: [{ required: true, message: '请输入物品价格', trigger: 'blur' }, { type: 'number', message: '请输入有效的数字', trigger: 'blur' }],
  userId: [{ required: true, message: '请输入用户ID', trigger: 'blur' }, { type: 'number', message: '请输入有效的用户ID', trigger: 'blur' }]
};

const submitForm = async () => {
  try {
    await itemForm.value.validate();
    const response = await axios.post('http://localhost:8080/shop/add', formData);
    ElMessage.success('物品发布成功！');
    router.push('/');
  } catch (error) {
    if (error.name === 'ValidationError') {
      return;
    }
    ElMessage.error('发布失败：' + (error.response?.data?.message || error.message));
  }
};

const resetForm = () => {
  itemForm.value.resetFields();
};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.add-item-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.add-item-card {
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}
</style>