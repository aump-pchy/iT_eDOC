<template>
  <div class="relative min-h-screen bg-gradient-to-br from-[#d4145a] via-[#fbb03b]/30 to-white text-slate-800 font-sans selection:bg-[#d4145a]/20 pb-16">
    
    <!-- ─── 🌌 MULTI-EFFECTS BACKGROUND LAYER (FIXED) ─── -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      
      <!-- 🟢 TECH GREEN LINES EFFECT -->
      <div class="tech-line bg-gradient-to-b from-transparent via-emerald-400 to-transparent absolute w-[2px] h-20" style="left: 15%; animation-duration: 3s; animation-delay: 0s;"></div>
      <div class="tech-line bg-gradient-to-b from-transparent via-green-400 to-transparent absolute w-[1.5px] h-32" style="left: 45%; animation-duration: 2s; animation-delay: 1s;"></div>
      <div class="tech-line bg-gradient-to-b from-transparent via-emerald-500 to-transparent absolute w-[2px] h-16" style="left: 65%; animation-duration: 4s; animation-delay: 0.5s;"></div>
      <div class="tech-line bg-gradient-to-b from-transparent via-green-500 to-transparent absolute w-[2.5px] h-24" style="left: 80%; animation-duration: 2.5s; animation-delay: 1.5s;"></div>

      <!-- 🫧 BINARY + SOAP BUBBLES EFFECT -->
      <div class="bubble-binary text-slate-800/40 text-xl font-mono absolute drop-shadow-[0_2px_5px_rgba(0,0,0,0.15)]" style="left: 8%; animation-delay: 0s; animation-duration: 9s;">0101</div>
      <div class="bubble-binary text-[#d4145a]/40 text-3xl font-mono absolute drop-shadow-[0_2px_5px_rgba(0,0,0,0.2)]" style="left: 28%; animation-delay: 3s; animation-duration: 12s;">10</div>
      <div class="bubble-binary text-slate-700/50 text-4xl font-mono absolute drop-shadow-[0_2px_5px_rgba(0,0,0,0.15)]" style="left: 52%; animation-delay: 1s; animation-duration: 14s;">0</div>
      <div class="bubble-binary text-amber-600/40 text-2xl font-mono absolute drop-shadow-[0_2px_5px_rgba(0,0,0,0.15)]" style="left: 73%; animation-delay: 5s; animation-duration: 10s;">1101</div>
      <div class="bubble-binary text-slate-800/40 text-5xl font-mono absolute drop-shadow-[0_2px_5px_rgba(0,0,0,0.2)]" style="left: 88%; animation-delay: 2s; animation-duration: 15s;">1</div>

      <div class="soap-bubble absolute rounded-full border border-slate-400/40 bg-gradient-to-tr from-white/10 to-slate-400/20 w-8 h-8 shadow-inner" style="left: 18%; animation-delay: 2s; animation-duration: 10s;"></div>
      <div class="soap-bubble absolute rounded-full border border-pink-400/30 bg-gradient-to-tr from-white/10 to-pink-400/20 w-14 h-14 shadow-inner" style="left: 38%; animation-delay: 0s; animation-duration: 13s;"></div>
      <div class="soap-bubble absolute rounded-full border border-slate-500/40 bg-gradient-to-tr from-white/5 to-slate-500/20 w-6 h-6 shadow-inner" style="left: 60%; animation-delay: 4s; animation-duration: 8s;"></div>
      <div class="soap-bubble absolute rounded-full border border-amber-400/30 bg-gradient-to-tr from-white/10 to-amber-400/20 w-11 h-11 shadow-inner" style="left: 82%; animation-delay: 6s; animation-duration: 11s;"></div>
    </div>

    <!-- ─── 🏷️ HEADER SECTION ─── -->
    <div class="relative pt-24 pb-12 text-center px-4 z-10">
      <h1 class="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/95 to-white/40 backdrop-blur-[2px] drop-shadow-[0_4px_12px_rgba(252,252,252,0.3)] uppercase">
        DEVELOPERS TEAM
      </h1>
      <div class="h-1.5 w-32 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-4 rounded-full shadow-sm animate-pulse"></div>
      <p class="text-white/90 text-xs md:text-sm font-bold mt-3 tracking-widest uppercase bg-black/10 backdrop-blur-md px-4  rounded-full inline-block border border-white/20 shadow-sm">
        แผนกวิชาเทคโนโลยีสารสนเทศ และ เทคโนโลยีปัญญาประดิษฐ์ • วิทยาลัยเทคนิคเลย
      </p>
    </div>

    <div class="text-center">
  <p class="text-white/90 text-xs md:text-sm font-bold tracking-widest uppercase bg-black/10 backdrop-blur-md px-4  rounded-full inline-block border border-white/20 shadow-sm">
    Trainnee GEN.5 of หจก.พิชญะ Service Everything Co., Ltd. • 2026
  </p>
</div>
    

    <!-- ─── 🎯 SECTION 1: FAST WARP AVATARS ─── -->
    <div class="relative max-w-4xl mx-auto px-4 mb-24 z-10">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 justify-center">
        <div 
          v-for="dev in developers"
          :key="dev.id"
          @click="scrollToDev(dev.id)"
          class="group relative flex flex-col items-center cursor-pointer transform active:scale-95 transition-transform duration-150"
        >
          <div class="absolute -top-10 opacity-0 group-hover:opacity-100 group-hover:-top-12 transition-all duration-300 bg-white/95 backdrop-blur-md border border-[#d4145a]/20 px-3 py-1 rounded-xl shadow-lg z-10 text-xs font-black text-[#d4145a] tracking-wider whitespace-nowrap">
            {{ dev.nickname.split(' ')[0] }} ⚡
          </div>

          <div class="relative w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-white/20 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_20px_50px_rgba(212,20,90,0.25)] group-hover:border-[#d4145a]/50">
            <img :src="dev.avatar1" alt="avatar default" class="w-full h-full object-cover transition-all duration-500 absolute inset-0 group-hover:opacity-0 group-hover:scale-95" />
            <img :src="dev.avatar2" alt="avatar hover" class="w-full h-full object-cover transition-all duration-500 absolute inset-0 opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100" />
          </div>

          <span class="mt-3 px-3 py-0.5 rounded-lg bg-black/20 backdrop-blur-sm text-white font-bold text-xs tracking-widest group-hover:text-yellow-300 group-hover:bg-black/40 transition-all uppercase border border-white/10">
            {{ dev.name.split(' ')[0] }}
          </span>
        </div>
      </div>
    </div>

    <!-- ─── 📜 SECTION 2: DETAILS ─── -->
    <div class="relative max-w-5xl mx-auto px-4 space-y-20 md:space-y-32 z-10">
      <div 
        v-for="(dev, index) in developers" 
        :key="dev.id"
        :id="dev.id"
        class="relative flex flex-col md:flex-row items-center gap-8 md:gap-16 scroll-mt-28"
        :class="{ 'md:flex-row-reverse': index % 2 !== 0 }"
      >
        <!-- เลขลำดับขนาดใหญ่ยักษ์พิเศษ -->
        <div class="absolute -top-20 md:-top-32 text-[14rem] md:text-[20rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-slate-800/25 to-transparent select-none tracking-tighter font-mono z-0 drop-shadow-sm" :class="index % 2 === 0 ? '-left-6 md:-left-12' : '-right-6 md:-right-12 text-right'">
          0{{ index + 1 }}
        </div>

        <!-- 🖼️ โซนรูปภาพโปรไฟล์ + อีโมจิธีมลอยรอบกรอบรูป (เพิ่มจำนวนและขนาดใหญ่ขึ้น!) -->
        <div class="w-full md:w-2/5 flex justify-center z-10">
          <div class="relative w-64 h-64 md:w-80 md:h-80 rounded-[2.5rem] bg-white/30 backdrop-blur-md border border-white/50 shadow-xl p-3 transform hover:rotate-2 transition-transform duration-300 group-avatar">
            
            <!-- 🌟 อีโมจิรอบกรอบรูป ปรับขนาดใหญ่บึ้มขึ้น (text-3xl md:text-4xl) ลอยกระจายตัวเต็มกรอบ 🌟 -->
            <div v-for="(emoji, i) in dev.emojis" :key="i" 
                 class="absolute text-3xl md:text-4xl select-none emoji-float drop-shadow-lg filter hover:scale-125 transition-transform duration-200"
                 :style="emoji.style">
              {{ emoji.char }}
            </div>

            <img :src="dev.avatar1" alt="developer profile" class="w-full h-full object-cover rounded-[1.8rem] relative z-10" />
          </div>
        </div>

        <!-- 📝 โซนข้อมูลประวัติและคำคม -->
        <div class="w-full md:w-3/5 space-y-4 text-center md:text-left z-10" :class="{ 'md:text-right': index % 2 !== 0 }">
          <div class="inline-block px-4 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-black text-slate-700 uppercase tracking-widest mb-1">
            MEMBER {{ index + 1 }}
          </div>
          
          <br>
          <h2 class="inline-block px-6 py-2.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 text-3xl md:text-4xl font-black text-slate-900 tracking-tight shadow-md">
            {{ dev.name }}
          </h2>

          <p class="text-base font-bold text-slate-600 flex items-center justify-center md:justify-start gap-1 pt-2" :class="{ 'md:justify-end': index % 2 !== 0 }">
            <span>🎓 ระดับชั้น:</span>
            <span class="text-[#d4145a] font-black bg-white/60 px-2.5 py-0.5 rounded-md shadow-sm">{{ dev.class }}</span>
          </p>
          
          <div class="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent md:from-slate-200 md:to-transparent" :class="{ 'md:from-transparent md:to-slate-200': index % 2 !== 0 }"></div>

          <!-- 🔗 โซเชียล และ กล่องคำคมประจำกลุ่ม -->
          <div class="flex flex-col gap-2.5 pt-2 font-medium text-sm text-slate-700">
            <a :href="dev.facebookUrl" target="_blank" class="flex items-center justify-center md:justify-start gap-3 hover:text-blue-600 transition-colors w-max mx-auto md:mx-0 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/40 shadow-sm" :class="{ 'md:mx-auto md:mr-0 md:flex-row-reverse': index % 2 !== 0 }">
              <svg class="w-5 h-5 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/></svg>
              <span>{{ dev.facebookName }}</span>
            </a>
            <a :href="dev.instagramUrl" target="_blank" class="flex items-center justify-center md:justify-start gap-3 hover:text-pink-600 transition-colors w-max mx-auto md:mx-0 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/40 shadow-sm" :class="{ 'md:mx-auto md:mr-0 md:flex-row-reverse': index % 2 !== 0 }">
              <svg class="w-5 h-5 text-pink-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              <span>{{ dev.instagramName }}</span>
            </a>
            
            <!-- 😎 กล่องคำคมประจำตัวสุดกวน -->
            <div class="flex items-center justify-center md:justify-start gap-2 w-max mx-auto md:mx-0 bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/50 shadow-sm italic text-slate-800 font-semibold" :class="{ 'md:mx-auto md:mr-0 md:flex-row-reverse': index % 2 !== 0 }">
              <span class="text-lg select-none">😎</span>
              <span class="tracking-wide">“{{ dev.คำคม }}”</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── 💖 FOOTER SECTION ─── -->
    <div class="relative mt-32 border-t border-slate-200/40 pt-12 text-center px-4 z-10">
      <p class="text-xl md:text-2xl font-black italic tracking-wide bg-gradient-to-r from-[#d4145a] to-slate-700 bg-clip-text text-transparent">
        Thank you for using our web application.
      </p>
      <p class="text-slate-400 text-xs mt-4 tracking-widest font-bold uppercase">
        by.เด็ก หจก.พิชญะ พรมลา
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const developers = ref([
  {
    id: 'dev2',
    name: 'นายภคิน เชื้อบุญมี',
    nickname: 'เมคเกอร์',
    class: 'ปวช.3 แผนกวิชาเทคโนโลยีสารสนเทศ',
    avatar1: '/mak2.jpg',
    avatar2: '/mak1.jpg',
    facebookName: 'Phakin Chueaboonmee',
    facebookUrl: 'https://www.facebook.com/ker7964?locale=th_TH',
    instagramName: '_mcker',
    instagramUrl: 'https://www.instagram.com/_mcker/',
    คำคม: 'อยากรู้จัก ก็ทักมา ง้อววววว',
    // 🔥 คนที่ 1: เมคเกอร์ - แนวกวนๆ ซ่าๆ (เพิ่มแบบแน่นกรอบ)
    emojis: [
      { char: '💥', style: 'top: -15px; left: -15px; animation-duration: 2.5s;' },
      { char: '😜', style: 'top: -25px; left: 40%; animation-duration: 3.2s;' },
      { char: '🔥', style: 'top: -10px; right: -15px; animation-duration: 2.8s;' },
      { char: '🤪', style: 'top: 50%; right: -30px; animation-duration: 3.5s;' },
      { char: '👻', style: 'bottom: -15px; right: -10px; animation-duration: 3s;' },
      { char: '🚀', style: 'bottom: -25px; left: 30%; animation-duration: 2.7s;' },
      { char: '📢', style: 'top: 45%; left: -30px; animation-duration: 3.4s;' }
    ]
  },
  {
    id: 'dev1',
    name: 'นางสาวณัฐรัตน์ เอี่ยมรัตน',
    nickname: 'ซาลาเปา เป่า เป้า เป๊า เป๋า',
    class: 'ปวช.3 แผนกวิชาเทคโนโลยีสารสนเทศ',
    avatar1: '/pao1.jpg', 
    avatar2: '/pao2.jpg',
    facebookName: 'Nattharat Aiamrat',
    facebookUrl: 'https://www.facebook.com/nattharat.aiamrat/?locale=th_TH',
    instagramName: 'sxlapaokubei_ei',
    instagramUrl: 'https://www.instagram.com/sxlapaokubei_ei/',
    คำคม: 'เรียกชื่อมันยากนัก เรียกเค้าที่รักกะดั้ย งึ้ยยย(ล้อเล่ง)',
    // 🌈 คนที่ 2: คุณเปา - แนวน่ารักกุ๊บกิ๊บ สายรุ้งฟรุ้งฟริ้งคูณสอง!
    emojis: [
      { char: '🌈', style: 'top: -25px; left: 10px; animation-duration: 4s;' },
      { char: '🎀', style: 'top: -20px; right: 20px; animation-duration: 2.5s;' },
      { char: '💖', style: 'top: 30%; right: -30px; animation-duration: 3s;' },
      { char: '🌸', style: 'bottom: 10px; right: -25px; animation-duration: 3.5s;' },
      { char: '✨', style: 'bottom: -25px; right: 35%; animation-duration: 2.2s;' },
      { char: '🐱', style: 'bottom: -15px; left: -10px; animation-duration: 3.8s;' },
      { char: '🧸', style: 'top: 40%; left: -30px; animation-duration: 2.9s;' }
    ]
  },
  {
    id: 'dev3',
    name: 'นายอัครชัย ครองตรี',
    nickname: 'ขุนโปร(น้ำคุณ)',
    class: 'ปวช.3 แผนกวิชาเทคโนโลยีสารสนเทศ',
    avatar1: '/pro1.jpg',
    avatar2: '/pro2.jpg',
    facebookName: 'Akkarachaı Krongtrı',
    facebookUrl: 'https://www.facebook.com/gjhejtk.rurcfu?locale=th_TH',
    instagramName: 'khun_idkkk',
    instagramUrl: 'https://www.instagram.com/khun_idkkk/',
    คำคม: 'ทำงานให้เท่า เล่าให้ถึง',
    // 🌀 คนที่ 3: ขุนโปร - แนวนึกมึนๆ เอ๋ยเบลอ หลุดไปอวกาศ
    emojis: [
      { char: '😵‍💫', style: 'top: -20px; right: -20px; animation-duration: 3s;' },
      { char: '🌀', style: 'top: -25px; left: 20px; animation-duration: 2.4s;' },
      { char: '👽', style: 'top: 35%; left: -30px; animation-duration: 3.6s;' },
      { char: '🛸', style: 'bottom: -25px; left: 15px; animation-duration: 4.2s;' },
      { char: '🪐', style: 'bottom: -15px; right: 10px; animation-duration: 2.8s;' },
      { char: '⭐', style: 'top: 40%; right: -30px; animation-duration: 3.1s;' },
      { char: '💭', style: 'top: -10px; right: 35%; animation-duration: 3.5s;' }
    ]
  },
  {
    id: 'dev4',
    name: 'นายอัษฎาวุธ พุทธรักษ์',
    nickname: 'โอม',
    class: 'ปวช.3 แผนกวิชาเทคโนโลยีสารสนเทศ',
    avatar1: '/ohm1.jpg',
    avatar2: '/ohm2.jpg',
    facebookName: 'Adsadawut Puttarak',
    facebookUrl: 'https://www.facebook.com/adsadawut.puttarak.2024?locale=th_TH',
    instagramName: 'ling_abcd',
    instagramUrl: 'https://www.instagram.com/ling_abcd/',
    คำคม: 'I still care, just from a distance now.',
    // 🕶️ คนที่ 4: โอม - แนวเงียบๆ ขรึมๆ แฮกเกอร์สายดาร์กสุดเท่
    emojis: [
      { char: '🕶️', style: 'top: -20px; left: 30%; animation-duration: 2.5s;' },
      { char: '💻', style: 'top: -15px; right: -15px; animation-duration: 3s;' },
      { char: '🥷', style: 'top: 35%; right: -25px; animation-duration: 3.3s;' },
      { char: '⚡', style: 'bottom: -20px; right: 20px; animation-duration: 2.2s;' },
      { char: '🎯', style: 'bottom: -25px; left: 25%; animation-duration: 3.8s;' },
      { char: '⚙️', style: 'bottom: 30%; left: -30px; animation-duration: 2.9s;' },
      { char: '🔒', style: 'top: -10px; left: -15px; animation-duration: 3.1s;' }
    ]
  }
])

const scrollToDev = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

/* ─── 🧪 ANIMATIONS ─── */
.bubble-binary {
  bottom: -150px;
  animation: floatUpScreen linear infinite;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.soap-bubble {
  bottom: -150px;
  animation: floatUpScreen ease-in-out infinite;
}

@keyframes floatUpScreen {
  0% { transform: translateY(0) scale(0.6) rotate(0deg); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translateY(-120vh) scale(1.2) rotate(360deg); opacity: 0; }
}

.tech-line {
  top: -150px;
  animation: cyberDrop linear infinite;
  opacity: 0.7;
}

@keyframes cyberDrop {
  0% { transform: translateY(0); }
  100% { transform: translateY(120vh); }
}

/* ─── 🧸 FLOATING EMOJIS (ขยายความพริ้ว ลอยดุ๊กดิ๊กสมดุลขึ้น) ─── */
.emoji-float {
  z-index: 20;
  animation: emojiWiggle 3.5s ease-in-out infinite alternate;
}

@keyframes emojiWiggle {
  0% {
    transform: translateY(0) scale(0.85) rotate(-8deg);
  }
  100% {
    transform: translateY(-15px) scale(1.15) rotate(12deg);
  }
}
</style>