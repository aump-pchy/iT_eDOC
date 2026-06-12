<template>
  <div class="min-h-screen bg-gray-50 py-8 px-6 md:pt-20">
    <div class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">

      <div class="mb-10">
        <h1 class="text-3xl font-semibold text-gray-800">
          จัดการข้อมูลผู้ใช้งาน
        </h1>
      </div>

      <div class="space-y-6">

        <div class="flex items-center gap-8">
          <label class="w-32 text-gray-700 font-medium">
            ชื่อ-สกุล
          </label>

          <input
            type="text"
            v-model="form.name"
            placeholder="กรอกชื่อ"
            class="flex-1 border border-gray-400 rounded-xl p-2.5 bg-white text-black font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
          />
        </div>

        <div class="flex items-center gap-8">
          <label class="w-32 text-gray-700 font-medium">
            ตำแหน่ง
          </label>

          <input
            type="text"
            v-model="form.position"
            placeholder="กรอกตำแหน่ง"
            class="flex-1 border border-gray-400 rounded-xl p-2.5 bg-white text-black font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
          />
        </div>

        <div class="flex items-center gap-8">
          <label class="w-32 text-gray-700 font-medium">
            อีเมล
          </label>

          <input
            type="email"
            v-model="form.email"
            placeholder="example@email.com"
            class="flex-1 border border-gray-400 rounded-xl p-2.5 bg-white text-black font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
          />
        </div>

        <div class="flex items-center gap-8">
          <label class="w-32 text-gray-700 font-medium">
            รหัสผ่าน
          </label>

          <input
            type="password"
            v-model="form.password"
            placeholder="********"
            class="flex-1 border border-gray-400 rounded-xl p-2.5 bg-white text-black font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
          />
        </div>

        <div class="flex items-center gap-8">
          <label class="w-32 text-gray-700 font-medium">
            สิทธิการใช้งาน
          </label>

          <select
            v-model="form.role"
            class="flex-1 border border-gray-400 rounded-xl p-2.5 bg-white text-black font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm cursor-pointer"
          >
            <option value="" disabled selected>เลือกสิทธิการใช้งาน</option>
            <option value="Admin">Admin</option>
            <option value="user">ผู้ใช้ทั่วไป</option>
          </select>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button
            v-if="isEditing"
            @click="cancelEdit"
            class="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition"
          >
            ยกเลิก
          </button>

          <button
            @click="submitForm"
            :class="isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-900'"
            class="text-white p-2 px-6 rounded-xl transition font-bold"
          >
            {{ isEditing ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล' }}
          </button>
        </div>

      </div>

      <div class="mt-14">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-2 border-b border-gray-100">
          <div class="flex items-center gap-4 w-full sm:w-auto flex-1">
            <h2 class="text-xl font-semibold text-gray-800 whitespace-nowrap">
              รายชื่อผู้ใช้งาน
            </h2>
            
            <input
              type="text"
              v-model="searchQuery"
              placeholder=" ค้นหาด้วย ชื่อ, อีเมล หรือสิทธิ"
              class="flex-1 max-w-md border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition text-sm"
            />
          </div>

          <span class="text-sm text-gray-400 whitespace-nowrap self-end sm:self-center">
            พบ {{ filteredUsers.length }} จากทั้งหมด {{ users.length }} Users
          </span>
        </div>

        <div
          v-if="filteredUsers.length === 0"
          class="text-center py-10 bg-gray-100 rounded-xl border border-gray-100 text-gray-500"
        >
          ไม่พบข้อมูลผู้ใช้งานที่ตรงตามเงื่อนไข
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            class="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:bg-gray-100 transition"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-3">
                <h3 class="font-medium text-gray-800">
                  {{ user.name }}
                </h3>
                <span
                  :class="user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-700'"
                  class="text-xs px-2.5 py-0.5 rounded-full font-medium"
                >
                  {{ user.role }}
                </span>
              </div>

              <p class="text-sm text-gray-500">
                <span class="font-medium text-gray-400">ตำแหน่ง:</span> {{ user.position }}
              </p>
              <p class="text-xs text-gray-400">
                <span class="font-medium">อีเมล:</span> {{ user.email }}
              </p>
            </div>

            <div class="flex gap-3">
              <button
                @click="editUser(user)"
                class="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
              >
                แก้ไข
              </button>

              <button
                @click="deleteUser(user)"
                class="px-4 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition"
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
import { ref, computed, onMounted } from "vue";

// ==========================================
// 🛠️ URL ของ Express Backend
// ==========================================
const API_URL = "http://localhost:3000/api/users";

// ดึง token จาก localStorage (เซฟไว้ตอน login)
const getToken = () => localStorage.getItem("token");

// helper สำหรับ fetch พร้อม Authorization header
const apiFetch = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");
  return data;
};

// ==========================================

const form = ref({
  name: "",
  position: "",
  email: "",
  password: "",
  role: "",
});

const users = ref([]);
const searchQuery = ref("");
const isEditing = ref(false);
const editId = ref(null);

// 📥 ดึงรายชื่อผู้ใช้งานจาก GET /api/users
const fetchUsers = async () => {
  try {
    const data = await apiFetch(API_URL);
    // backend ส่งกลับเป็น array โดยตรง
    users.value = data.map((u) => ({
      id: u.id,
      name: u.full_name || "",
      position: u.department || "",
      email: u.email || "",
      role: u.role || "user",
    }));
  } catch (err) {
    console.error("fetchUsers error:", err.message);
    alert("ดึงข้อมูลไม่สำเร็จ: " + err.message);
  }
};

onMounted(() => {
  const savedUsers = localStorage.getItem("saved_users");
  if (savedUsers) {
    users.value = JSON.parse(savedUsers);
  } else {
    users.value = [
      {
        id: 1,
        name: "สมชาย ใจดี",
        position: "Admin",
        email: "somchai@email.com",
        password: "password123",
        role: "Admin"
      },
      {
        id: 2,
        name: "สมหญิง รักเรียน",
        position: "Marketing",
        email: "somying@email.com",
        password: "password456",
        role: "ผู้ใช้ทั่วไป"
      }
    ];
    saveToStorage();
  }
  fetchUsers();
});

const saveToStorage = () => {
  localStorage.setItem("saved_users", JSON.stringify(users.value));
};

// 🔍 ค้นหา Real-time
const filteredUsers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return users.value;
  return users.value.filter(
    (u) =>
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.role && u.role.toLowerCase().includes(query)) ||
      (u.position && u.position.toLowerCase().includes(query))
  );
});

const resetForm = () => {
  form.value = { name: "", position: "", email: "", password: "", role: "" };
  isEditing.value = false;
  editId.value = null;
};

const submitForm = () => {
// 💾 บันทึก / แก้ไข
const submitForm = async () => {
  if (
    !form.value.name ||
    !form.value.position ||
    !form.value.email ||
    !form.value.role ||
    (!isEditing.value && !form.value.password)
  ) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  try {
    if (isEditing.value) {
      // PUT /api/users/:id
      const body = {
        full_name: form.value.name,
        department: form.value.position,
        role: form.value.role,
      };
      if (form.value.password) body.password = form.value.password;

      await apiFetch(`${API_URL}/${editId.value}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      alert("แก้ไขข้อมูลผู้ใช้งานสำเร็จ");
    } else {
      // POST /api/users
      await apiFetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          full_name: form.value.name,
          department: form.value.position,
          email: form.value.email,
          password: form.value.password,
          role: form.value.role,
        }),
      });
      alert("เพิ่มผู้ใช้งานเข้าฐานข้อมูลสำเร็จ");
    }

    await fetchUsers();
    resetForm();
  } catch (err) {
    alert("เกิดข้อผิดพลาดในการบันทึก: " + err.message);
  }
};

// ✏️ โหลดข้อมูลขึ้นฟอร์มเพื่อแก้ไข
const editUser = (user) => {
  isEditing.value = true;
  editId.value = user.id;
  form.value = {
    name: user.name,
    position: user.position,
    email: user.email,
    password: "",
    role: user.role,
  };
};

const cancelEdit = () => resetForm();

const deleteUser = (user) => {
  const isConfirmed = confirm(`คุณต้องการยืนยันที่จะลบข้อมูลของ "${user.name}" ใช่หรือไม่?`);
// ❌ ลบผู้ใช้งาน DELETE /api/users/:id
const deleteUser = async (user) => {
  const isConfirmed = confirm(
    `คุณต้องการยืนยันที่จะลบข้อมูลของ "${user.name}" ใช่หรือไม่?`
  );
  if (isConfirmed) {
    try {
      await apiFetch(`${API_URL}/${user.id}`, { method: "DELETE" });
      alert("ลบข้อมูลสำเร็จ");
      await fetchUsers();
    } catch (err) {
      alert("ลบข้อมูลผิดพลาด: " + err.message);
    }
  }
};
</script>