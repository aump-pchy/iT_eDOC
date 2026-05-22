<template>
  <div class="min-h-screen bg-gray-100 py-10 px-6">
    <div class="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm p-10">

      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl font-semibold text-gray-800">
          Manage Users
        </h1>

        <p class="text-gray-400 mt-2">
          จัดการข้อมูลผู้ใช้งาน
        </p>
      </div>

      <!-- Form -->
      <div class="space-y-6">

        <!-- ชื่อ -->
        <div class="flex items-center gap-8">
          <label class="w-32 text-gray-700 font-medium">
            ชื่อ-สกุล
          </label>

          <input
            type="text"
            v-model="form.name"
            placeholder="กรอกชื่อ"
            class="flex-1 border border-gray-300 rounded-xl px-4 py-3
                   bg-gray-50
                   focus:outline-none
                   focus:ring-2
                   focus:ring-gray-300
                   transition"
          />
        </div>

        <!-- ตำแหน่ง -->
        <div class="flex items-center gap-8">
          <label class="w-32 text-gray-700 font-medium">
            ตำแหน่ง
          </label>

          <input
            type="text"
            v-model="form.position"
            placeholder="กรอกตำแหน่ง"
            class="flex-1 border border-gray-300 rounded-xl px-4 py-3
                   bg-gray-50
                   focus:outline-none
                   focus:ring-2
                   focus:ring-gray-300
                   transition"
          />
        </div>

        <!-- อีเมล -->
        <div class="flex items-center gap-8">
          <label class="w-32 text-gray-700 font-medium">
            อีเมล
          </label>

          <input
            type="email"
            v-model="form.email"
            placeholder="example@email.com"
            class="flex-1 border border-gray-300 rounded-xl px-4 py-3
                   bg-gray-50
                   focus:outline-none
                   focus:ring-2
                   focus:ring-gray-300
                   transition"
          />
        </div>

        <!-- รหัสผ่าน -->
        <div class="flex items-center gap-8">
          <label class="w-32 text-gray-700 font-medium">
            รหัสผ่าน
          </label>

          <input
            type="password"
            v-model="form.password"
            placeholder="********"
            class="flex-1 border border-gray-300 rounded-xl px-4 py-3
                   bg-gray-50
                   focus:outline-none
                   focus:ring-2
                   focus:ring-gray-300
                   transition"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-4">
          <!-- ปุ่มยกเลิก (จะแสดงขึ้นมาเฉพาะตอนที่กำลังแก้ไขข้อมูลเท่านั้น) -->
          <button
            v-if="isEditing"
            @click="cancelEdit"
            class="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl
                   hover:bg-gray-300 transition"
          >
            ยกเลิก
          </button>

          <!-- ปุ่มบันทึก (เปลี่ยนข้อความและสีตามสถานะ) -->
          <button
            @click="submitForm"
            :class="isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-900'"
            class="text-white px-8 py-3 rounded-xl transition"
          >
            {{ isEditing ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล' }}
          </button>
        </div>

      </div>

      <!-- User List -->
      <div class="mt-14">

        <div class="flex justify-between items-center mb-5">
          <h2 class="text-xl font-semibold text-gray-800">
            รายชื่อผู้ใช้งาน
          </h2>

          <span class="text-sm text-gray-400">
            {{ users.length }} Users
          </span>
        </div>

        <!-- Empty -->
        <div
          v-if="users.length === 0"
          class="text-center py-10 bg-gray-100 rounded-xl border border-gray-100"
        >
          ยังไม่มีข้อมูลผู้ใช้งาน
        </div>

        <!-- List -->
        <div
          v-else
          class="space-y-4"
        >
          <div
            v-for="(user, index) in users"
            :key="index"
            class="flex items-center justify-between
                   bg-gray-50 border border-gray-200
                   rounded-2xl p-5 hover:bg-gray-100 transition"
          >

            <!-- Info -->
            <div>
              <h3 class="font-medium text-gray-800">
                {{ user.name }}
              </h3>

              <p class="text-sm text-gray-500 mt-1">
                {{ user.position }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">

              <button
                @click="editUser(index)"
                class="px-4 py-2 rounded-xl bg-blue-50 text-blue-600
                       hover:bg-blue-100 transition"
              >
                แก้ไข
              </button>

              <button
                @click="deleteUser(index)"
                class="px-4 py-2 rounded-xl bg-red-50 text-red-500
                       hover:bg-red-100 transition"
              >
                ลบ
              </button>

            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// โครงสร้างฟอร์มรับข้อมูล
const form = ref({
  name: "",
  position: "",
  email: "",
  password: "",
});

// Mock ข้อมูลตัวอย่างเริ่มต้น (เพิ่ม Mock Email/Password เพื่อให้พร้อมทำงาน)
const users = ref([
  {
    name: "สมชาย ใจดี",
    position: "Admin",
    email: "somchai@email.com",
    password: "password123"
  },
]);

// State ตรวจจับว่ากำลังอยู่ใน "โหมดแก้ไข" หรือไม่
const isEditing = ref(false);
const editIndex = ref(null);

// ฟังก์ชันล้างค่าฟอร์มให้กลับเป็นสถานะว่างเปล่าเริ่มต้น
const resetForm = () => {
  form.value = {
    name: "",
    position: "",
    email: "",
    password: "",
  };
  isEditing.value = false;
  editIndex.value = null;
};

// ฟังก์ชันทำงานหลักเมื่อกดปุ่ม "บันทึก"
const submitForm = () => {
  // ตรวจสอบค่าว่าง
  if (
    !form.value.name ||
    !form.value.position ||
    !form.value.email ||
    !form.value.password
  ) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  if (isEditing.value) {
    // ถ้าอยู่ในโหมดแก้ไข -> ทำการเขียนข้อมูลทับลงไปที่ตำแหน่งเดิมในอาร์เรย์
    users.value[editIndex.value] = {
      name: form.value.name,
      position: form.value.position,
      email: form.value.email,
      password: form.value.password,
    };
  } else {
    // ถ้าอยู่ในโหมดปกติ -> ทำการเพิ่มข้อมูลใหม่ต่อท้ายเข้าไป
    users.value.push({
      name: form.value.name,
      position: form.value.position,
      email: form.value.email,
      password: form.value.password,
    });
  }

  // รีเซ็ตหน้าฟอร์มให้ว่างหลังจากกดบันทึกเสร็จ
  resetForm();
};

// ฟังก์ชันดึงข้อมูลจากแถวที่ต้องการแก้ไข เด้งขึ้นไปโชว์ในกล่องข้อความด้านบน
const editUser = (index) => {
  isEditing.value = true;
  editIndex.value = index;

  // เอาข้อมูลตัวที่เลือกมาแปะลงในตัวแปร form
  const currentUser = users.value[index];
  form.value = {
    name: currentUser.name,
    position: currentUser.position,
    email: currentUser.email || "",
    password: currentUser.password || "",
  };
};

// ฟังก์ชันสำหรับกดยกเลิกการแก้ไข
const cancelEdit = () => {
  resetForm();
};

// ฟังก์ชันลบข้อมูลผู้ใช้งาน
const deleteUser = (index) => {
  // เคสป้องกัน: ถ้ากำลังแก้ไขแถวนี้อยู่แล้วดันทลึ่งมากดลบ ให้เคลียร์ฟอร์มทิ้งทันทีป้องกันบั๊กอินเด็กซ์เคลื่อน
  if (isEditing.value && editIndex.value === index) {
    resetForm();
  }
  users.value.splice(index, 1);
};
</script>