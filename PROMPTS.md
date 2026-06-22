# AI 二次元分身图片生成指南

本 demo 中，三位女主播的二次元分身目前使用风格化 SVG 占位图。如需替换为恋与深空风格的高精度写实二次元立绘，可使用以下提示词在 Midjourney / Stable Diffusion / 即梦 / 可灵等工具中生成。

## 通用画风参考

恋与深空风格特征：

- 高精度 3D 写实渲染，接近真人但保留二次元美型比例
- 皮肤细腻通透，光影柔和，带有轻微梦幻光晕
- 眼睛大而明亮，瞳孔细节丰富，眼神有情绪
- 发型有层次感和自然光泽
- 服装精致，材质感强（丝绸、蕾丝、金属配饰等）
- 背景氛围感强，常用暖光、星光、粒子、柔焦

## 主播 1：幼甜（软糯甜欲少女）

**关键词：** 清纯、甜美、少女感、长发、圆眼、浅色妆容

**Midjourney 提示词：**

```
Portrait of a beautiful young Chinese woman, Love and Deepspace game style, realistic 3D anime render, soft and sweet girl, long straight dark brown hair with subtle highlights, large round sparkling eyes, fair skin with natural blush, light pink glossy lips, gentle shy expression, wearing a delicate white lace camisole, soft warm indoor lighting, bokeh background with pink curtains, dreamy atmosphere, cinematic lighting, ultra detailed, 8k --ar 9:16 --niji 6 --style raw
```

**保存路径：** `assets/ai/youtian.png`

## 主播 2：发升米（知性温柔姐姐）

**关键词：** 知性、温柔、姐姐感、眼镜、成熟、浅色系穿搭

**Midjourney 提示词：**

```
Portrait of an elegant Chinese woman, Love and Deepspace game style, realistic 3D anime render, intellectual gentle older sister vibe, medium-length dark hair, elegant thin-framed glasses, warm brown eyes, soft makeup, light nude lips, calm and caring expression, wearing a silky light blue halter top with delicate gold necklace, indoor soft lighting, modern minimalist background with plant shadows, sophisticated atmosphere, cinematic lighting, ultra detailed, 8k --ar 9:16 --niji 6 --style raw
```

**保存路径：** `assets/ai/fashengmi.png`

## 主播 3：锦汐Sisi（野魅破碎御姐）

**关键词：** 成熟、御姐、魅惑、长发、精致妆容、深色背景

**Midjourney 提示词：**

```
Portrait of a stunning mature Chinese woman, Love and Deepspace game style, realistic 3D anime render, wild and alluring yujie vibe, long wavy black hair, sharp but captivating eyes with dramatic eyelashes, flawless porcelain skin, rose-tinted glossy lips, confident slightly mysterious expression, wearing an elegant off-shoulder floral dress with diamond necklace, luxurious indoor background with warm ambient light and green plants, seductive yet refined atmosphere, cinematic lighting, ultra detailed, 8k --ar 9:16 --niji 6 --style raw
```

**保存路径：** `assets/ai/jinxi.png`

## 替换方式

1. 生成图片后，按上述路径保存到 `assets/ai/` 目录。
2. 在 `js/data.js` 中，将对应主播的 `aiImage` 字段从 `null` 改为图片路径，例如：

```js
{
  id: 'youtian',
  // ...
  aiImage: 'assets/ai/youtian.png'
}
```

3. 刷新页面，剧情页会自动显示对应主播的 AI 二次元分身立绘。

## 注意事项

- 生成工具可能对中文姓名和特定长相理解有限，建议上传主播真人参考图作为 Image Prompt，以获得更接近本人脸部特征的结果。
- 如需保持脸部特征一致，可先用真人照片训练 LoRA，再用上述提示词生成。
- 商业化使用前请确认生成图片的版权归属与主播授权。
