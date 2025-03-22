// تحسينات عامة لتوافق الهواتف المحمولة
document.addEventListener('DOMContentLoaded', function() {
  // الكشف عن نوع الجهاز
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // إضافة فئة للجسم للتعرف على الأجهزة المحمولة في CSS
    document.body.classList.add('mobile-device');
    
    // تحسين التمرير للأجهزة المحمولة
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // إذا كان الرابط يشير إلى قسم في نفس الصفحة
        if (this.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          const targetId = this.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
    
    // تحسين التفاعل مع الأزرار
    const allButtons = document.querySelectorAll('button, .btn, .nav-link, .feature-card');
    allButtons.forEach(button => {
      // إضافة تأثير لمس أفضل
      button.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
      }, { passive: true });
      
      button.addEventListener('touchend', function() {
        this.style.transform = '';
      }, { passive: true });
    });
    
    // تحسين أداء الرسوم المتحركة
    const animations = document.querySelectorAll('.animated, .animation');
    animations.forEach(animation => {
      animation.style.animationDuration = '0.5s';
    });
    
    // تقليل تأثيرات الخلفية لتحسين الأداء
    const backgroundEffects = document.querySelectorAll('.background-effect, .particles, .purple-rain');
    backgroundEffects.forEach(effect => {
      if (effect.id === 'purple-rain') {
        // تقليل عدد قطرات المطر
        effect.innerHTML = '';
        const raindropsCount = 30;
        for (let i = 0; i < raindropsCount; i++) {
          createRaindrop(effect);
        }
      } else {
        // تقليل شفافية التأثيرات الأخرى
        effect.style.opacity = '0.5';
      }
    });
    
    // تحسين حجم الخط للإدخال
    const inputElements = document.querySelectorAll('input, textarea');
    inputElements.forEach(input => {
      input.style.fontSize = '16px'; // منع تكبير الشاشة تلقائيًا على iOS
    });
  }
  
  // تعديل الارتفاع لشاشات الهواتف
  function adjustHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  // تنفيذ ضبط الارتفاع عند التحميل وتغيير حجم الشاشة
  adjustHeight();
  window.addEventListener('resize', adjustHeight);

  // وظائف التحدث النصي باستخدام ResponsiveVoice
  if (typeof responsiveVoice !== 'undefined') {
    // عناصر واجهة حوار التحدث النصي
    const ttsDialog = document.getElementById('tts-dialog');
    const ttsCloseBtn = document.getElementById('tts-close-btn');
    const ttsVoiceSelect = document.getElementById('tts-voice');
    const ttsRateInput = document.getElementById('tts-rate');
    const ttsRateValue = document.getElementById('tts-rate-value');
    const ttsPitchInput = document.getElementById('tts-pitch');
    const ttsPitchValue = document.getElementById('tts-pitch-value');
    const ttsText = document.getElementById('tts-text');
    const ttsPlayBtn = document.getElementById('tts-play-btn');
    const ttsPauseBtn = document.getElementById('tts-pause-btn');
    const ttsStopBtn = document.getElementById('tts-stop-btn');
    
    // إضافة زر التحدث النصي إلى القائمة
    addTtsButton();
    
    // تحديث قيم السرعة والنبرة
    ttsRateInput.addEventListener('input', function() {
      ttsRateValue.textContent = this.value;
    });
    
    ttsPitchInput.addEventListener('input', function() {
      ttsPitchValue.textContent = this.value;
    });
    
    // إغلاق واجهة الحوار
    ttsCloseBtn.addEventListener('click', function() {
      ttsDialog.classList.remove('active');
    });
    
    // تشغيل التحدث النصي
    ttsPlayBtn.addEventListener('click', function() {
      const text = ttsText.value.trim();
      if (text) {
        const voice = ttsVoiceSelect.value;
        const rate = parseFloat(ttsRateInput.value);
        const pitch = parseFloat(ttsPitchInput.value);
        
        responsiveVoice.speak(text, voice, {
          rate: rate,
          pitch: pitch,
          onstart: function() {
            ttsPlayBtn.disabled = true;
            ttsPauseBtn.disabled = false;
            ttsStopBtn.disabled = false;
          },
          onend: function() {
            resetTtsButtons();
          },
          onerror: function() {
            resetTtsButtons();
            alert('حدث خطأ أثناء التشغيل');
          }
        });
      } else {
        alert('الرجاء إدخال نص للقراءة');
      }
    });
    
    // إيقاف التحدث النصي مؤقتًا
    ttsPauseBtn.addEventListener('click', function() {
      if (responsiveVoice.isPlaying()) {
        if (ttsPauseBtn.querySelector('span').textContent === 'pause') {
          // إيقاف مؤقت
          responsiveVoice.pause();
          ttsPauseBtn.querySelector('span').textContent = 'play_arrow';
          ttsPauseBtn.querySelector('span').nextSibling.textContent = 'استئناف';
        } else {
          // استئناف
          responsiveVoice.resume();
          ttsPauseBtn.querySelector('span').textContent = 'pause';
          ttsPauseBtn.querySelector('span').nextSibling.textContent = 'إيقاف مؤقت';
        }
      }
    });
    
    // إيقاف التحدث النصي
    ttsStopBtn.addEventListener('click', function() {
      responsiveVoice.cancel();
      resetTtsButtons();
    });
    
    // إعادة تعيين أزرار التحكم
    function resetTtsButtons() {
      ttsPlayBtn.disabled = false;
      ttsPauseBtn.disabled = true;
      ttsStopBtn.disabled = true;
      ttsPauseBtn.querySelector('span').textContent = 'pause';
      ttsPauseBtn.querySelector('span').nextSibling.textContent = 'إيقاف مؤقت';
    }
    
    // إضافة زر التحدث النصي إلى القائمة
    function addTtsButton() {
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) {
        const ttsLink = document.createElement('a');
        ttsLink.href = 'javascript:void(0);';
        ttsLink.className = 'nav-link';
        ttsLink.innerHTML = `
          <span class="material-symbols-rounded icon">record_voice_over</span>
          <span>التحدث النصي</span>
        `;
        
        ttsLink.addEventListener('click', function() {
          ttsDialog.classList.add('active');
        });
        
        navLinks.appendChild(ttsLink);
      }
    }
  } else {
    console.error('ResponsiveVoice غير متوفر');
  }
});

// دالة إنشاء قطرة مطر (إذا كانت موجودة في الصفحة)
function createRaindrop(container) {
  if (typeof createRaindrop !== 'function') {
    const raindrop = document.createElement('div');
    raindrop.className = 'raindrop';
    
    // تعيين موقع عشوائي
    const posX = Math.random() * 100;
    raindrop.style.left = `${posX}%`;
    
    // تعيين حجم عشوائي
    const size = Math.random() * 2 + 1;
    raindrop.style.width = `${size}px`;
    raindrop.style.height = `${size * 10}px`;
    
    // تعيين سرعة عشوائية
    const duration = Math.random() * 5 + 3;
    raindrop.style.animationDuration = `${duration}s`;
    
    // تعيين تأخير عشوائي
    const delay = Math.random() * 5;
    raindrop.style.animationDelay = `${delay}s`;
    
    // إضافة قطرة المطر إلى الحاوية
    container.appendChild(raindrop);
  }
} 