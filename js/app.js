/**
 * 心遇伴行 Demo - 应用交互层
 */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== 页面元素 =====
const els = {
  livePage: $('#live-page'),
  storyPage: $('#story-page'),
  liveBg: $('#live-bg'),
  anchorAvatar: $('#anchor-avatar'),
  anchorName: $('#anchor-name'),
  anchorFollowers: $('#anchor-followers'),
  floatEntry: $('#float-entry'),
  storyBg: $('#story-bg'),
  storyTitle: $('#story-title'),
  moodTag: $('#mood-tag'),
  dialogueText: $('#dialogue-text'),
  optionsArea: $('#options-area'),
  endingBox: $('#ending-box'),
  endingTitle: $('#ending-title'),
  endingDesc: $('#ending-desc'),
  endingBtn: $('#ending-btn'),
  bondFill: $('#bond-fill'),
  bondText: $('#bond-text'),
  queueToast: $('#queue-toast'),
  vipFloat: $('#vip-float'),
  anchorList: $('#anchor-list'),
  switchEnabled: $('#switch-enabled'),
  switchLock: $('#switch-lock'),
  modalAnchor: $('#modal-anchor'),
  modalControl: $('#modal-control'),
  heroineImg: $('#heroine-img')
};

let typewriterTimer = null;
let currentSpeech = null;

// ===== 初始化 =====
function init() {
  renderLivePage();
  renderAnchorList();
  renderVipCards();
  bindEvents();
  updateBondUI();
}

// ===== 直播页渲染 =====
function renderLivePage() {
  const anchor = game.getAnchor();
  els.anchorAvatar.src = anchor.avatar;
  els.anchorName.textContent = anchor.name;
  els.anchorFollowers.textContent = `${anchor.followers} · ${anchor.online}人看过`;
  els.liveBg.style.backgroundImage = `url(${anchor.avatar})`;
  document.documentElement.style.setProperty('--primary', anchor.themeColor);

  if (game.enabled) {
    els.floatEntry.classList.remove('hidden');
  } else {
    els.floatEntry.classList.add('hidden');
  }
}

// ===== 主播列表渲染 =====
function renderAnchorList() {
  els.anchorList.innerHTML = ANCHORS.map(a => {
    const bond = game.getBond(a.id);
    const level = game.getLevel(bond);
    const activeClass = a.id === game.currentAnchorId ? 'active' : '';
    return `
      <div class="anchor-item ${activeClass}" data-id="${a.id}">
        <img src="${a.avatar}" alt="${a.name}" />
        <div class="anchor-item-info">
          <div class="anchor-item-name">${a.name}</div>
          <div class="anchor-item-tag">${a.tag} · ${a.followers}</div>
          <div class="anchor-item-bond">羁绊：${level.name} · ${bond}</div>
        </div>
      </div>
    `;
  }).join('');
}

// ===== 商业化卡片渲染 =====
function renderVipCards() {
  els.vipFloat.innerHTML = VIP_OFFERS.map(v => `
    <div class="vip-card ${v.hot ? 'hot' : ''}" onclick="alert('【${v.title}】为演示入口，暂不支持真实支付')">
      <div class="vip-card-title">${v.title}</div>
      <div class="vip-card-desc">${v.desc}</div>
      <div class="vip-card-price">${v.price}</div>
    </div>
  `).join('');
}

// ===== 事件绑定 =====
function bindEvents() {
  // 切换主播
  $('#btn-switch-anchor').addEventListener('click', () => openModal('modal-anchor'));
  els.anchorList.addEventListener('click', (e) => {
    const item = e.target.closest('.anchor-item');
    if (!item) return;
    game.switchAnchor(item.dataset.id);
    renderLivePage();
    renderAnchorList();
    updateBondUI();
    closeModal('modal-anchor');
  });

  // 主播管控
  $('#btn-control').addEventListener('click', () => openModal('modal-control'));
  els.switchEnabled.addEventListener('click', () => {
    game.setEnabled(!game.enabled);
    els.switchEnabled.classList.toggle('on', game.enabled);
    renderLivePage();
  });
  els.switchLock.addEventListener('click', () => {
    els.switchLock.classList.toggle('on');
  });
  $('#btn-clear-queue').addEventListener('click', () => {
    game.clearQueue();
    alert('已清空当前互动队列');
    closeModal('modal-control');
  });

  // 进入剧情
  els.floatEntry.addEventListener('click', enterStoryFlow);

  // 退出剧情
  $('#btn-back').addEventListener('click', exitStory);
  els.endingBtn.addEventListener('click', exitStory);

  // 弹窗关闭
  $$('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });
  $$('.modal-overlay').forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) closeModal(m.id);
    });
  });

  // 会员按钮
  $('#btn-vip').addEventListener('click', () => {
    alert('主播专属羁绊会员为演示入口，暂不支持真实支付。');
  });
}

function openModal(id) {
  $(`#${id}`).classList.add('show');
}

function closeModal(id) {
  $(`#${id}`).classList.remove('show');
}

// ===== 进入剧情流程 =====
function enterStoryFlow() {
  els.queueToast.classList.add('show');

  // 模拟排队
  setTimeout(() => {
    els.queueToast.classList.remove('show');
    switchToPage('story');
    startStoryForAnchor();
  }, 1500);
}

function switchToPage(name) {
  if (name === 'story') {
    els.livePage.classList.remove('active');
    els.storyPage.classList.add('active');
  } else {
    els.storyPage.classList.remove('active');
    els.livePage.classList.add('active');
  }
}

function startStoryForAnchor() {
  const anchor = game.getAnchor();
  const storyKey = anchor.category;
  const story = STORIES[storyKey];

  els.storyBg.className = `story-bg ${story.bgClass}`;
  els.storyTitle.textContent = story.title;

  // 加载主播专属AI二次元分身
  if (anchor.aiImage) {
    els.heroineImg.src = anchor.aiImage;
    els.heroineImg.classList.remove('heroine-svg');
    els.heroineImg.style.width = '100%';
    els.heroineImg.style.height = '100%';
    els.heroineImg.style.objectFit = 'cover';
    els.heroineImg.style.objectPosition = 'center top';
    els.heroineImg.style.borderRadius = '0';
    $('.heroine-tag').textContent = 'AI二次元分身 · 专属形象';
  } else {
    els.heroineImg.src = 'assets/placeholder/heroine.svg';
    els.heroineImg.classList.add('heroine-svg');
    els.heroineImg.style.width = '';
    els.heroineImg.style.height = '';
    els.heroineImg.style.objectFit = '';
    els.heroineImg.style.objectPosition = '';
    els.heroineImg.style.borderRadius = '';
    $('.heroine-tag').textContent = 'AI二次元分身 · 占位示意';
  }

  game.startStory(storyKey);
  renderNode();
}

// ===== 渲染剧情节点 =====
function renderNode() {
  const node = game.getCurrentNode();
  if (!node) return;

  // 情绪标签
  const mood = MOODS[node.mood] || MOODS.gentle;
  els.moodTag.textContent = mood.label;

  // 清空旧选项
  els.optionsArea.innerHTML = '';

  // 逐字打印台词
  typewriter(node.text, () => {
    if (node.ending) {
      showEnding(node);
    } else {
      renderOptions(node.options);
    }
  });

  // 语音朗读
  speakText(node.text, mood);
}

function typewriter(text, onDone) {
  clearTimeout(typewriterTimer);
  els.dialogueText.innerHTML = '<span class="dialogue-cursor"></span>';
  let i = 0;
  const cursor = '<span class="dialogue-cursor"></span>';

  function step() {
    if (i <= text.length) {
      els.dialogueText.innerHTML = text.slice(0, i) + cursor;
      i++;
      typewriterTimer = setTimeout(step, 42);
    } else {
      if (onDone) onDone();
    }
  }
  step();
}

function renderOptions(options) {
  if (!options) return;
  els.optionsArea.innerHTML = options.map((opt, idx) => `
    <button class="option-btn" data-idx="${idx}">
      ${opt.text}
      <span class="option-bond">${opt.bond > 0 ? '+' + opt.bond : opt.bond}</span>
    </button>
  `).join('');

  $$('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => onChooseOption(parseInt(btn.dataset.idx)));
  });
}

function onChooseOption(idx) {
  const node = game.chooseOption(idx);
  updateBondUI();
  if (node) renderNode();
}

function showEnding(node) {
  const level = game.getLevel();
  els.endingTitle.textContent = node.endingTag || '剧情结局';
  els.endingDesc.innerHTML = `${node.text}<br/><br/>当前羁绊等级：<b style="color:${level.color}">${level.name}</b>`;
  els.endingBox.classList.add('show');
}

function exitStory() {
  game.endStory();
  els.endingBox.classList.remove('show');
  stopSpeech();
  switchToPage('live');
  updateBondUI();
  renderAnchorList();
}

// ===== 羁绊UI更新 =====
function updateBondUI() {
  const bond = game.getBond();
  const level = game.getLevel(bond);
  const nextMin = game.nextLevelBond();
  let pct = 100;
  if (nextMin !== null) {
    pct = Math.min(100, ((bond - level.min) / (nextMin - level.min)) * 100);
  }
  els.bondFill.style.height = `${pct}%`;
  els.bondText.textContent = level.name;
  els.bondText.style.color = level.color;
}

// ===== TTS 语音 =====
function speakText(text, mood) {
  if (!window.speechSynthesis) return;
  stopSpeech();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = mood.rate;
  u.pitch = mood.pitch;
  u.volume = 1;

  // 尝试选一个中文女声
  const voices = window.speechSynthesis.getVoices();
  const zhVoice = voices.find(v => v.lang.includes('zh') && v.name.includes('Female'))
    || voices.find(v => v.lang.includes('zh'))
    || voices[0];
  if (zhVoice) u.voice = zhVoice;

  currentSpeech = u;
  window.speechSynthesis.speak(u);
}

function stopSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentSpeech = null;
}

// 某些浏览器需要用户交互后才加载语音列表
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {};
}

// ===== 启动 =====
init();
