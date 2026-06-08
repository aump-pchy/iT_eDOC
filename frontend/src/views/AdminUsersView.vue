<template>
  <div class="min-h-screen bg-gray-50 py-8 px-6 md:pt-20 ">
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
            class="flex-1 border border-gray-300 rounded-xl p-2
                   bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
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
            class="flex-1 border border-gray-300 rounded-xl p-2
                   bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
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
            class="flex-1 border border-gray-300 rounded-xl p-2
                   bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
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
            class="flex-1 border border-gray-300 rounded-xl p-2
                   bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
          />
        </div>

        <div class="flex items-center gap-8">
          <label class="w-32 text-gray-700 font-medium">
            สิทธิการใช้งาน
          </label>

          <select
            v-model="form.role"
            class="flex-1 border border-gray-300 rounded-xl p-2
                   bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
          >
            <option value="" disabled selected>เลือกสิทธิการใช้งาน</option>
            <option value="Admin">Admin</option>
            <option value="ผู้ใช้ทั่วไป">ผู้ใช้ทั่วไป</option>
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
            class="text-white p-2 px-6 rounded-xl transition"
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

        <div
          v-else
          class="space-y-4"
        >
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            class="flex items-center justify-between
                   bg-gray-50 border border-gray-200
                   rounded-2xl p-5 hover:bg-gray-100 transition"
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
import { createClient } from "@supabase/supabase-js";

// ==========================================
// 🛠️ สายเชื่อมต่อตรงเข้าคลาวด์ Supabase ของคุณ
// ==========================================
const supabaseUrl = "https://blvofgahkeiatjtfqjaz.supabase.co"; 
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsdm9mZ2Foa2VpYXRqdGZxamF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NDk2ODIsImV4cCI6MjA5NTIyNTY4Mn0.yEFvzcALpWgI3K0siiLc0WEodj_c0gTbqOUYbRXOwc8"; 
const supabase = createClient(supabaseUrl, supabaseKey);
// ==========================================

// โครงสร้างฟอร์ม (ใช้ชื่อตัวแปรเดิมที่คุณออกแบบไว้เป๊ะๆ)
const form = ref({
  name: "",
  position: "",
  email: "",
  password: "",
  role: "",
});

// อาร์เรย์สำหรับเก็บรายชื่อผู้ใช้งานเพื่อเอาไปวนลูปแสดงผล
const users = ref([]);

// ตัวแปรค้นหา
const searchQuery = ref("");

// State ควบคุมโหมดแก้ไข
const isEditing = ref(false);
const editId = ref(null);

// 📥 ฟังก์ชันดึงข้อมูลจากตาราง profiles (แปลงค่าหลังบ้านให้เข้ากับดีไซน์ฟรอนต์เอนด์)
const fetchUsers = async () => {
  try {
    // แก้จาก "users" เป็น "profiles" เพื่อให้ตรงกับตารางบน Supabase
    const { data, error } = await supabase
      .from("profiles") 
      .select("*");

    if (error) throw error;

    if (data) {
      // แปลงชื่อคอลัมน์จาก Supabase (full_name, department) 
      // เข้ามาที่ตัวแปรเดิมของหน้าฟรอนต์เอนด์คุณ (name, position) 
      users.value = data.map(user => ({
        id: user.id,               
        name: user.full_name || "",      
        position: user.department || "",  
        email: user.email || "",
        password: user.password || "",
        role: user.role || "user"
      }));
    } else {
      users.value = [];
    }

  } catch (error) {
    console.error("Error fetching users:", error.message);
    // เพิ่มบรรทัดนี้เพื่อเช็กหากระบบยังดึงข้อมูลไม่ได้ จะมีหน้าต่าง Alert แจ้งเตือนสาเหตุทันที
    alert("เกิดปัญหาตอนดึงข้อมูล: " + error.message); 
  }
};
// เรียกดึงข้อมูลทันทีเมื่อเปิดหน้าจอ localhost
onMounted(() => {
  fetchUsers();
});

// ตัวกรองสืบค้นแบบ Real-time บนหน้าเว็บของคุณ
// 🔍 หาฟังก์ชัน filteredUsers ของเดิมในโค้ดของคุณ แล้วเปลี่ยนเป็นชุดนี้ครับ:
const filteredUsers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  
  // ถ้าช่องค้นหาว่างเปล่า ให้ดึงข้อมูลผู้ใช้งานทุกคน (users.value) ออกไปโชว์ทันที
  if (!query) return users.value;

  // ถ้ามีการพิมพ์ค้นหา ให้กรองข้อมูลอย่างปลอดภัย
  return users.value.filter((user) => {
    return (
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.role && user.role.toLowerCase().includes(query)) ||
      (user.position && user.position.toLowerCase().includes(query))  
    );
  });
});

// ฟังก์ชันเคลียร์ค่าในช่องฟอร์มให้ว่างเปล่า
const resetForm = () => {
  form.value = { name: "", position: "", email: "", password: "", role: "" };
  isEditing.value = false;
  editId.value = null;
};

// 💾 ฟังก์ชันกดปุ่มบันทึกข้อมูล (ส่งข้อมูลจากฟอร์มเดิมของคุณแปลงเข้าสู่ตาราง Profiles บนคลาวด์)
const submitForm = async () => {
  if (!form.value.name || !form.value.position || !form.value.email || !form.value.role || (!isEditing.value && !form.value.password)) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  try {
    if (isEditing.value) {
      // 🔄 จังหวะกดเซฟการ "แก้ไขข้อมูล"
      const updatedData = {
        full_name: form.value.name,       // ส่งค่าในฟอร์ม name ไปเซฟลงช่อง full_name ในคลาวด์
        department: form.value.position,   // ส่งค่าในฟอร์ม position ไปเซฟลงช่อง department ในคลาวด์
        email: form.value.email,
        role: form.value.role,
      };

      if (form.value.password) updatedData.password = form.value.password;

      const { error } = await supabase
        .from("profiles")
        .update(updatedData)
        .eq("id", editId.value);

      if (error) throw error;
      alert("แก้ไขข้อมูลผู้ใช้งานสำเร็จ");
    } else {
      // ➕ จังหวะกดเซฟ "เพิ่มผู้ใช้งานใหม่"
      const { error } = await supabase
        .from("profiles")
        .insert([
          {
            full_name: form.value.name,       // ส่งไปเก็บที่ช่อง full_name
            department: form.value.position,   // ส่งไปเก็บที่ช่อง department
            email: form.value.email,
            password: form.value.password,
            role: form.value.role,
          },
        ]);

      if (error) throw error;
      alert("เพิ่มผู้ใช้งานเข้าฐานข้อมูลสำเร็จ");
    }

    // โหลดรายชื่ออัปเดตใหม่ และล้างข้อมูลในฟอร์มออก
    await fetchUsers();
    resetForm();
  } catch (error) {
    alert("เกิดข้อผิดพลาดในการบันทึก: " + error.message);
  }
};

// จังหวะกดปุ่มแก้ไขเพื่อดึงข้อมูลเก่ากลับขึ้นไปค้างบนฟอร์ม
const editUser = (user) => {
  isEditing.value = true;
  editId.value = user.id;

  form.value = {
    name: user.name,
    position: user.position,
    email: user.email,
    password: "", // ปล่อยรหัสผ่านว่างไว้ให้กรอกใหม่ถ้าต้องการเปลี่ยน
    role: user.role,
  };
};

const cancelEdit = () => {
  resetForm();
};

// ❌ ฟังก์ชันกดปุ่มลบข้อมูลผู้ใช้งานออกแบบตามไอดี UUID
const deleteUser = async (user) => {
  const isConfirmed = confirm(`คุณต้องการยืนยันที่จะลบข้อมูลของ "${user.name}" ใช่หรือไม่?`);
  if (isConfirmed) {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (error) throw error;
      alert("ลบข้อมูลสำเร็จ");
      await fetchUsers(); // ดึงรายชื่อใหม่หลังหักลบเสร็จ
    } catch (error) {
      alert("ลบข้อมูลผิดพลาด: " + error.message);
    }
  }
};
</script>