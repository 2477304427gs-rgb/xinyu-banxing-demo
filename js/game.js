/**
 * 心遇伴行 Demo - 游戏状态与羁绊系统
 *
 * 依赖 data.js 在全局作用域声明的 ANCHORS / MOODS / BOND_LEVELS / STORIES
 */

// Node 测试环境：加载 data.js 导出的数据到全局
if (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined') {
  const data = require('./data.js');
  Object.assign(global, data);
}

class GameState {
  constructor() {
    this.currentAnchorId = localStorage.getItem('xinyu_current_anchor') || 'youtian';
    this.bonds = this.loadBonds();
    this.storyProgress = this.loadProgress();
    this.enabled = localStorage.getItem('xinyu_enabled') !== 'false';
    this.inStory = false;
    this.currentStoryId = null;
    this.currentNodeId = null;
    this.afkTimer = null;
    this.onUpdate = null;
  }

  loadBonds() {
    try {
      return JSON.parse(localStorage.getItem('xinyu_bonds')) || {};
    } catch {
      return {};
    }
  }

  loadProgress() {
    try {
      return JSON.parse(localStorage.getItem('xinyu_progress')) || {};
    } catch {
      return {};
    }
  }

  save() {
    localStorage.setItem('xinyu_bonds', JSON.stringify(this.bonds));
    localStorage.setItem('xinyu_progress', JSON.stringify(this.storyProgress));
    localStorage.setItem('xinyu_current_anchor', this.currentAnchorId);
    localStorage.setItem('xinyu_enabled', String(this.enabled));
  }

  getAnchor() {
    return ANCHORS.find(a => a.id === this.currentAnchorId) || ANCHORS[0];
  }

  getBond(anchorId = this.currentAnchorId) {
    return this.bonds[anchorId] || 0;
  }

  addBond(delta) {
    const id = this.currentAnchorId;
    this.bonds[id] = Math.max(0, (this.bonds[id] || 0) + delta);
    this.save();
    if (this.onUpdate) this.onUpdate();
  }

  getLevel(bond) {
    const b = bond ?? this.getBond();
    for (let i = BOND_LEVELS.length - 1; i >= 0; i--) {
      if (b >= BOND_LEVELS[i].min) return BOND_LEVELS[i];
    }
    return BOND_LEVELS[0];
  }

  nextLevelBond() {
    const bond = this.getBond();
    for (const lvl of BOND_LEVELS) {
      if (bond < lvl.min) return lvl.min;
    }
    return null;
  }

  switchAnchor(id) {
    this.currentAnchorId = id;
    this.save();
    if (this.onUpdate) this.onUpdate();
  }

  setEnabled(v) {
    this.enabled = v;
    this.save();
    if (this.onUpdate) this.onUpdate();
  }

  startStory(storyId) {
    const story = STORIES[storyId];
    if (!story) return false;
    this.inStory = true;
    this.currentStoryId = storyId;
    this.currentNodeId = 'start';
    this.resetAfk();
    return true;
  }

  getCurrentNode() {
    if (!this.inStory || !this.currentStoryId) return null;
    return STORIES[this.currentStoryId].nodes[this.currentNodeId];
  }

  chooseOption(index) {
    const node = this.getCurrentNode();
    if (!node || node.ending || !node.options) return null;
    const opt = node.options[index];
    if (!opt) return null;
    this.addBond(opt.bond);
    this.currentNodeId = opt.next;
    this.resetAfk();
    return this.getCurrentNode();
  }

  endStory() {
    this.inStory = false;
    this.currentStoryId = null;
    this.currentNodeId = null;
    this.clearAfk();
  }

  resetAfk() {
    this.clearAfk();
    this.afkTimer = setTimeout(() => {
      this.endStory();
      if (this.onUpdate) this.onUpdate();
      const showAlert = typeof alert !== 'undefined' ? alert : (msg) => console.warn(msg);
      showAlert('你很久没回应了，本次剧情互动已自动结束。');
    }, 30000);
  }

  clearAfk() {
    if (this.afkTimer) {
      clearTimeout(this.afkTimer);
      this.afkTimer = null;
    }
  }

  clearQueue() {
    this.endStory();
  }
}

const game = new GameState();

// 暴露到全局，确保跨 script 标签可访问
if (typeof window !== 'undefined') {
  window.game = game;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GameState, game };
}
