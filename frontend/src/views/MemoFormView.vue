<template>
  <div class="p-8 mt-7 max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-gray-100">
    <h1 class="text-2xl font-bold text-gray-800 mb-12 flex items-center gap-2">
      MemoForm
    </h1>

    <form @submit.prevent class="space-y-12">
      <div class="flex flex-col md:flex-row md:items-center gap-2">
        <label class="w-full md:w-48 text-gray-800 font-semibold text-lg">
          เลขที่ บันทึกข้อความ ทส.
        </label>
        <input 
          type="text" 
          class="flex-1 py-2.5 px-4 border-2 border-gray-300 rounded-xl bg-white text-gray-950 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors font-medium"
          placeholder="กรอกเลขที่บันทึกข้อความ"
        />
      </div>

      <div class="flex flex-col md:flex-row md:items-center gap-2">
        <label class="w-full md:w-48 text-gray-800 font-semibold text-lg">
          เรื่อง
        </label>
        <input 
          type="text" 
          class="flex-1 py-2.5 px-4 border-2 border-gray-300 rounded-xl bg-white text-gray-950 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors font-medium"
          placeholder="กรอกเรื่อง"
        />
      </div>

      <div class="flex flex-col md:flex-row md:items-center gap-2">
        <label class="w-full md:w-48 text-gray-800 font-semibold text-lg">
          เรียน
        </label>
        <input 
          type="text" 
          class="flex-1 py-2.5 px-4 border-2 border-gray-300 rounded-xl bg-white text-gray-950 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors font-medium"
          placeholder="กรอกชื่อผู้อำนวยการ"
        />
      </div>

      <div class="flex flex-col md:flex-row md:items-center gap-2">
        <label class="w-full md:w-48 text-gray-800 font-semibold text-lg">
          ผู้ดำเนินการ
        </label>
        <select 
          class="flex-1 py-2.5 px-4 border-2 border-gray-300 rounded-xl bg-white text-gray-950 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer font-medium"
          style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 0.65rem auto;"
        >
          <option value="" disabled selected class="text-gray-400">เลือกผู้ดำเนินการ</option>
          <option value="1" class="text-gray-950 bg-white">เจ้าหน้าที่บุคคล</option>
          <option value="2" class="text-gray-950 bg-white">เจ้าหน้าที่ไอที</option>
          <option value="3" class="text-gray-950 bg-white">หัวหน้าแผนก</option>
        </select>
      </div>

      <div class="pt-6 flex justify-end">
        <button 
          type="submit" 
          class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-colors"
        >
          บันทึกข้อมูล
        </button>
      </div>
    </form>
  </div>
</template>