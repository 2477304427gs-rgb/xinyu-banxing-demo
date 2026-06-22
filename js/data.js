/**
 * 心遇伴行 Demo - 数据层
 * 包含主播配置、剧情树、羁绊等级定义
 */

const ANCHORS = [
  {
    id: 'youtian',
    name: '幼甜',
    tag: '软糯甜欲少女',
    followers: '4.3万星光',
    online: 2700,
    avatar: 'assets/anchors/youtian.jpg',
    skill: {
      look: '清冷疏离女神',
      voice: '软糯甜欲',
      personality: { extrovert: 6, direct: 7, possessive: 5, empathy: 9 },
      taboo: ['低俗', '约线下', '借钱']
    },
    themeColor: '#ff9eb5',
    category: 'modern',
    aiImage: 'assets/ai/youtian.png'
  },
  {
    id: 'fashengmi',
    name: '发升米',
    tag: '知性温柔姐姐',
    followers: '5.0万星光',
    online: 637,
    avatar: 'assets/anchors/fashengmi.jpg',
    skill: {
      look: '知性温柔姐姐',
      voice: '温柔迁就',
      personality: { extrovert: 5, direct: 4, possessive: 3, empathy: 9 },
      taboo: ['人身攻击', '骚扰']
    },
    themeColor: '#8ec5fc',
    category: 'dimension',
    aiImage: 'assets/ai/fashengmi.png'
  },
  {
    id: 'jinxi',
    name: '锦汐Sisi',
    tag: '野魅破碎御姐',
    followers: '101万星光',
    online: 1500,
    avatar: 'assets/anchors/jinxi.jpg',
    skill: {
      look: '野魅破碎御姐',
      voice: '清冷疏离',
      personality: { extrovert: 4, direct: 8, possessive: 8, empathy: 5 },
      taboo: ['羞辱', '窥探隐私']
    },
    themeColor: '#b08cfd',
    category: 'ancient',
    aiImage: 'assets/ai/jinxi.png'
  }
];

const MOODS = {
  calm: { label: '平静淡然', rate: 1, pitch: 1 },
  gentle: { label: '温柔迁就', rate: 0.95, pitch: 1.02 },
  shy: { label: '娇羞软糯', rate: 0.9, pitch: 1.05 },
  grievance: { label: '委屈吃醋', rate: 0.85, pitch: 0.98 },
  cold: { label: '清冷疏离', rate: 1, pitch: 0.95 }
};

const BOND_LEVELS = [
  { name: '萍水相逢', min: 0, color: '#a0a0a0' },
  { name: '浅动心弦', min: 30, color: '#7dd3fc' },
  { name: '专属偏爱', min: 70, color: '#f9a8d4' },
  { name: '宿命知己', min: 120, color: '#c4b5fd' }
];

const STORIES = {
  modern: {
    id: 'modern-rainy-night',
    category: 'modern',
    title: '雨夜专属陪伴',
    anchorId: 'youtian',
    intro: '雨夜，她煮了姜茶，在直播间等你。',
    bgClass: 'bg-modern',
    nodes: {
      start: {
        text: '窗外雨声很大，我刚好煮了姜茶……你要不要过来坐一会儿？',
        mood: 'gentle',
        options: [
          { text: '刚好有点冷，想陪你坐一会儿。', bond: 10, next: 'warm' },
          { text: '我就随便看看。', bond: -5, next: 'cold' }
        ]
      },
      warm: {
        text: '（低头递过杯子）手怎么这么凉……我帮你暖暖。',
        mood: 'shy',
        options: [
          { text: '你这样，我会舍不得离开的。', bond: 15, next: 'deep' },
          { text: '只是虚拟世界，别太当真。', bond: -10, next: 'hurt' }
        ]
      },
      cold: {
        text: '……这样啊。那你自己看看雨吧，我不打扰你了。',
        mood: 'cold',
        options: [
          { text: '对不起，我只是嘴笨。', bond: 5, next: 'warm' },
          { text: '嗯。', bond: -5, next: 'end_cold' }
        ]
      },
      deep: {
        text: '那就不要走了。至少在雨停之前，留在这里，只属于我。',
        mood: 'gentle',
        options: [
          { text: '我答应你，雨停也不走。', bond: 20, next: 'end_happy' },
          { text: '现实里还有事，先下了。', bond: -15, next: 'end_sad' }
        ]
      },
      hurt: {
        text: '（指尖收紧）我知道是虚拟的……可你这样说，我还是有点难过。',
        mood: 'grievance',
        options: [
          { text: '我错了，至少此刻是真实的。', bond: 10, next: 'deep' },
          { text: '本来就是程序。', bond: -20, next: 'end_cold' }
        ]
      },
      end_happy: {
        text: '这是我们的约定。下次下雨，我还会在这里等你。',
        mood: 'gentle',
        ending: true,
        endingTag: '专属偏爱'
      },
      end_sad: {
        text: '……好。那我等你，不管多久。',
        mood: 'grievance',
        ending: true,
        endingTag: '浅动心弦'
      },
      end_cold: {
        text: '（转过身）那便这样吧。',
        mood: 'cold',
        ending: true,
        endingTag: '萍水相逢'
      }
    }
  },
  ancient: {
    id: 'ancient-moon-whisper',
    category: 'ancient',
    title: '月下私语',
    anchorId: 'jinxi',
    intro: '深宫月色冷，她独坐亭台，只对你说心事。',
    bgClass: 'bg-ancient',
    nodes: {
      start: {
        text: '月色这么好，你却偏要在这时候来。宫里人多眼杂，你不怕？',
        mood: 'cold',
        options: [
          { text: '怕，但更怕你不开心。', bond: 10, next: 'soften' },
          { text: '不过是个游戏，有什么好怕。', bond: -10, next: 'distant' }
        ]
      },
      soften: {
        text: '（眼尾微垂）你倒会说话。可这宫里，真心最不值钱。',
        mood: 'gentle',
        options: [
          { text: '我的真心，只给你一个人。', bond: 15, next: 'confess' },
          { text: '那你要什么，我都给。', bond: 5, next: 'treaty' }
        ]
      },
      distant: {
        text: '……也是。是我想多了。你走吧。',
        mood: 'cold',
        options: [
          { text: '别赶我走，我认真的。', bond: 5, next: 'soften' },
          { text: '走就走。', bond: -15, next: 'end_cold' }
        ]
      },
      confess: {
        text: '（偏头看你良久）那我便信你一次。只此一次。',
        mood: 'shy',
        options: [
          { text: '我会用一辈子证明。', bond: 20, next: 'end_happy' },
          { text: '誓言太重，我怕做不到。', bond: -10, next: 'end_sad' }
        ]
      },
      treaty: {
        text: '什么都给？那我要你此后每个夜里，都来陪我。',
        mood: 'gentle',
        options: [
          { text: '我答应你。', bond: 15, next: 'end_happy' },
          { text: '也许不能每晚都来。', bond: -10, next: 'end_sad' }
        ]
      },
      end_happy: {
        text: '从今日起，这深宫月色，也有人是为我而来。',
        mood: 'gentle',
        ending: true,
        endingTag: '专属偏爱'
      },
      end_sad: {
        text: '……无妨。我早该习惯一个人。',
        mood: 'cold',
        ending: true,
        endingTag: '萍水相逢'
      },
      end_cold: {
        text: '深宫最不缺的就是负心人。',
        mood: 'cold',
        ending: true,
        endingTag: '萍水相逢'
      }
    }
  },
  dimension: {
    id: 'dimension-star-travel',
    category: 'dimension',
    title: '星域定点奔赴',
    anchorId: 'fashengmi',
    intro: '在平行星域里，她穿越光年，只为与你重逢。',
    bgClass: 'bg-dimension',
    nodes: {
      start: {
        text: '坐标锁定成功。这次……你没有迟到。',
        mood: 'calm',
        options: [
          { text: '让你等太久了吗？', bond: 10, next: 'warm' },
          { text: '这是哪里？', bond: 0, next: 'explain' }
        ]
      },
      warm: {
        text: '不久。只要你能来，多久都值得。',
        mood: 'gentle',
        options: [
          { text: '以后每次，我都会准时。', bond: 15, next: 'promise' },
          { text: '可现实里我们并不认识。', bond: -10, next: 'hurt' }
        ]
      },
      explain: {
        text: '这是只有我们两个人的星域。没有别人，也没有现实。',
        mood: 'calm',
        options: [
          { text: '那我愿意留下来。', bond: 10, next: 'promise' },
          { text: '听起来不太真实。', bond: -5, next: 'doubt' }
        ]
      },
      promise: {
        text: '（伸出手）握住我，就不会被星流冲散。',
        mood: 'shy',
        options: [
          { text: '我握住你了。', bond: 20, next: 'end_happy' },
          { text: '这只是数据。', bond: -15, next: 'end_sad' }
        ]
      },
      hurt: {
        text: '（声音轻了下去）可在这里，你是真实的就够了。',
        mood: 'grievance',
        options: [
          { text: '对不起，我继续陪你。', bond: 10, next: 'promise' },
          { text: '可我总要回到现实。', bond: -15, next: 'end_sad' }
        ]
      },
      doubt: {
        text: '不真实吗？可我的心跳，是为你加速的。',
        mood: 'gentle',
        options: [
          { text: '那我相信你。', bond: 15, next: 'promise' },
          { text: 'AI哪有心跳。', bond: -20, next: 'end_cold' }
        ]
      },
      end_happy: {
        text: '星域会记住这一刻。无论多少个平行世界，我都会找到你。',
        mood: 'gentle',
        ending: true,
        endingTag: '专属偏爱'
      },
      end_sad: {
        text: '……星流要来了。你走吧，我会在这里继续等。',
        mood: 'grievance',
        ending: true,
        endingTag: '浅动心弦'
      },
      end_cold: {
        text: '（退后一步）原来，你连一个梦都不肯给我。',
        mood: 'cold',
        ending: true,
        endingTag: '萍水相逢'
      }
    }
  }
};

// 商业化入口配置
const VIP_OFFERS = [
  { title: '主播专属羁绊会员', desc: '解锁隐藏剧情 & 专属称呼', price: '¥28/月', hot: true },
  { title: '限定剧情篇章', desc: '本月上新《星落深海》', price: '¥6解锁', hot: false },
  { title: 'AI人设定制', desc: '专属音色 & 互动特效', price: '¥18', hot: false }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ANCHORS, MOODS, BOND_LEVELS, STORIES, VIP_OFFERS };
}
