/* === 大广赛阿里云命题 · 共享工具函数 === */

/**
 * Toast 提示
 */
function showToast(message, duration = 2000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration + 300);
}

/**
 * 复制到剪贴板
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('已复制到剪贴板');
    return true;
  } catch {
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    showToast('已复制到剪贴板');
    return true;
  }
}

/**
 * 分享（优先使用 Web Share API）
 */
async function shareContent(title, text, url) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return;
    } catch (e) {
      // 用户取消分享
    }
  }
  // 降级：展示自定义分享面板
  showSharePanel(title, text, url);
}

/**
 * 展示自定义分享面板
 */
function showSharePanel(title, text, url) {
  const overlay = document.createElement('div');
  overlay.className = 'share-overlay';
  overlay.innerHTML = `
    <div class="share-panel slide-up">
      <h3>分享作品</h3>
      <div class="share-options">
        <div class="share-option" data-action="wechat">
          <div class="share-icon" style="background:#07C160">💬</div>
          <span>微信</span>
        </div>
        <div class="share-option" data-action="weibo">
          <div class="share-icon" style="background:#E6162D">📢</div>
          <span>微博</span>
        </div>
        <div class="share-option" data-action="copy">
          <div class="share-icon" style="background:#333">📋</div>
          <span>复制链接</span>
        </div>
        <div class="share-option" data-action="more">
          <div class="share-icon" style="background:#666">⋯</div>
          <span>更多</span>
        </div>
      </div>
      <button class="btn btn-secondary btn-block" style="margin-top:24px" onclick="this.closest('.share-overlay').remove()">
        取消
      </button>
    </div>
  `;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
    const action = e.target.closest('.share-option')?.dataset.action;
    if (action === 'copy') copyToClipboard(url || window.location.href);
    if (action === 'weibo') window.open(`https://service.weibo.com/share/share.php?title=${encodeURIComponent(title + ' ' + text)}&url=${encodeURIComponent(url || window.location.href)}`);
    if (action) overlay.remove();
  });

  document.body.appendChild(overlay);
}

/**
 * 创建粒子背景
 */
function createParticles(count = 30) {
  const container = document.createElement('div');
  container.className = 'particles-bg';

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = (Math.random() * 4 + 2) + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';
    // 随机混合橘色和蓝色
    if (Math.random() > 0.5) {
      particle.style.background = 'var(--brand-blue)';
    }
    container.appendChild(particle);
  }

  return container;
}

/**
 * 创建光晕背景
 */
function createGlowOrbs() {
  const fragment = document.createDocumentFragment();
  const orb1 = document.createElement('div');
  orb1.className = 'glow-orb glow-orb-orange';
  const orb2 = document.createElement('div');
  orb2.className = 'glow-orb glow-orb-blue';
  fragment.appendChild(orb1);
  fragment.appendChild(orb2);
  return fragment;
}

/**
 * 打字机效果
 */
async function typewriterEffect(element, text, speed = 50) {
  element.textContent = '';
  element.style.borderRight = '2px solid var(--brand-orange)';
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    await new Promise(r => setTimeout(r, speed + Math.random() * 30));
  }
  element.style.borderRight = 'none';
}

/**
 * 延迟函数
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 随机选择
 */
function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 生成唯一ID
 */
function generateId() {
  return 'dgs_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
}

/**
 * 获取URL参数
 */
function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

/* ================================================================
 * 阿里云百炼平台 API 集成
 * ================================================================
 *
 * 使用前请完成以下步骤：
 * 1. 领取300元算力：https://university.aliyun.com/action/sun-ada
 * 2. 获取API Key：https://bailian.console.aliyun.com/ → 开通百炼 →
 *    右上角头像 → API-KEY管理 → 创建新的API Key
 * 3. 将API Key填入下方 DASHSCOPE_API_KEY 常量
 * 4. 取消注释真实API调用代码，注释掉演示数据返回
 *
 * 文档：https://help.aliyun.com/zh/model-studio/
 * 兼容模式文档：https://help.aliyun.com/zh/model-studio/use-qwen-by-calling-api
 */

// ===== 配置区域 =====
const DASHSCOPE_API_KEY = '';  // ← 在此填入你的API Key
const DASHSCOPE_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';

// 模型配置
const MODELS = {
  text: 'qwen-max',           // 文本生成（最强版）
  vision: 'qwen-vl-max',      // 多模态视觉识别
  code: 'qwen-coder-plus',    // 代码专用
};

/**
 * 千问API调用（真实实现）
 *
 * @param {string} prompt - 用户提示词
 * @param {Object} options
 * @param {string} options.systemPrompt - 系统提示词（角色设定）
 * @param {number} options.temperature - 温度 (0-2)，默认0.8
 * @param {string} options.model - 模型名，默认qwen-max
 * @returns {Promise<string|null>} AI返回的文本，失败或未配置时返回null
 */
async function callQianwenAPI(prompt, options = {}) {
  // 未配置API Key时，返回null让调用方使用演示数据
  if (!DASHSCOPE_API_KEY) {
    console.warn('[千问API] 未配置API Key，使用演示数据。请在 shared/utils.js 中设置 DASHSCOPE_API_KEY');
    return null;
  }

  const messages = [];
  if (options.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  try {
    const response = await fetch(`${DASHSCOPE_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || MODELS.text,
        messages: messages,
        temperature: options.temperature ?? 0.8,
        max_tokens: options.maxTokens || 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[千问API] 请求失败:', response.status, errorData);
      return null;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    console.log('[千问API] 成功获取响应，长度:', text.length);
    return text;
  } catch (error) {
    console.error('[千问API] 网络错误:', error.message);
    return null;
  }
}

/**
 * 千问多模态视觉识别API
 * 上传图片并让千问识别图片内容
 *
 * @param {string} imageBase64 - 图片的base64编码（不含data:前缀）
 * @param {string} prompt - 对图片的提问
 * @returns {Promise<string|null>} 识别结果
 */
async function callQianwenVisionAPI(imageBase64, prompt) {
  if (!DASHSCOPE_API_KEY) {
    console.warn('[千问视觉API] 未配置API Key');
    return null;
  }

  try {
    const response = await fetch(`${DASHSCOPE_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODELS.vision,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
            { type: 'text', text: prompt },
          ],
        }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error('[千问视觉API] 请求失败:', response.status);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('[千问视觉API] 网络错误:', error.message);
    return null;
  }
}

/**
 * 调用千问API并重试（带指数退避）
 */
async function callQianwenAPIWithRetry(prompt, options = {}, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const result = await callQianwenAPI(prompt, options);
    if (result !== null) return result;
    if (attempt < maxRetries - 1) {
      const waitMs = Math.pow(2, attempt) * 1000;
      console.log(`[千问API] 第${attempt + 1}次重试，等待${waitMs}ms...`);
      await delay(waitMs);
    }
  }
  return null;
}

/**
 * 万相API调用封装
 * 文档: https://help.aliyun.com/zh/model-studio/wanxiang
 *
 * @param {string} prompt - 生成图像的描述
 * @param {string} type - 'text2img' | 'img2video' 等
 * @returns {Promise<string|null>} 生成的图片URL或null
 */
async function callWanxiangAPI(prompt, type = 'text2img') {
  if (!DASHSCOPE_API_KEY) {
    console.warn('[万相API] 未配置API Key');
    return null;
  }

  // 万相文生图API
  if (type === 'text2img') {
    try {
      const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/image-generation/generation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
          'Content-Type': 'application/json',
          'X-DashScope-Async': 'enable',
        },
        body: JSON.stringify({
          model: 'wanx-v1',
          input: {
            prompt: prompt,
            negative_prompt: '低质量，模糊，变形',
          },
          parameters: {
            n: 1,
            size: '1024*1024',
          },
        }),
      });

      if (!response.ok) {
        console.error('[万相API] 请求失败:', response.status);
        return null;
      }

      const data = await response.json();
      // 异步任务，返回task_id用于后续查询
      if (data.output?.task_id) {
        console.log('[万相API] 异步任务已创建:', data.output.task_id);
        return await pollWanxiangTask(data.output.task_id);
      }
      return null;
    } catch (error) {
      console.error('[万相API] 网络错误:', error.message);
      return null;
    }
  }

  console.warn('[万相API] 不支持的类型:', type);
  return null;
}

/**
 * 轮询万相异步任务结果
 */
async function pollWanxiangTask(taskId, maxAttempts = 30, interval = 2000) {
  for (let i = 0; i < maxAttempts; i++) {
    await delay(interval);
    try {
      const response = await fetch(
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
        { headers: { 'Authorization': `Bearer ${DASHSCOPE_API_KEY}` } }
      );
      const data = await response.json();

      if (data.output?.task_status === 'SUCCEEDED') {
        return data.output.results?.[0]?.url || null;
      }
      if (data.output?.task_status === 'FAILED') {
        console.error('[万相API] 任务失败:', data.output.message);
        return null;
      }
      // 继续轮询
    } catch (error) {
      console.error('[万相API] 轮询错误:', error.message);
    }
  }
  console.error('[万相API] 轮询超时');
  return null;
}
