/* =========================================================
  もと情報アカデミー LP - JavaScript
  ---------------------------------------------------------
  1. スマホメニュー
  2. FAQ開閉
  3. Googleフォーム送信（画面遷移なし / カスタムUI）
  4. 必須バリデーション
  5. スクロール表示
  6. 料金数字カウントアップ
========================================================= */

const GOOGLE_FORM_CONFIG = {
  url: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLScdMHnjCAXTQv4wlUVTZ-H1C68lm_0mp8mdisE4QRyD7cPrBw/formResponse',
  entryIds: {
    name: 'entry.1222301912',
    email: 'entry.322927418',
    message: 'entry.289483082',
    course: 'entry.1602744192',
  },
  sentinelIds: {
    course: 'entry.1602744192_sentinel',
  },
};

const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
const header = document.querySelector('[data-header]');
const form = document.querySelector('[data-contact-form]');
const formMessage = document.querySelector('[data-form-message]');
const submitButton = document.querySelector('[data-submit-button]');

navToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.faq-item').forEach((item) => {
  item.addEventListener('click', () => item.classList.toggle('is-open'));
});

const isGoogleFormConfigured = () => {
  const { url, entryIds, sentinelIds } = GOOGLE_FORM_CONFIG;
  const hasRealUrl = url.includes('docs.google.com/forms') && url.includes('/formResponse');
  const hasRealEntryIds = Object.values(entryIds).every((id) => /^entry\.\d+$/.test(id));
  const hasValidSentinels = Object.values(sentinelIds || {}).every((id) => /^entry\.\d+_sentinel$/.test(id));
  return hasRealUrl && hasRealEntryIds && hasValidSentinels;
};

const setFormMessage = (message, type = 'info') => {
  if (!formMessage) return;
  formMessage.textContent = message;
  formMessage.dataset.type = type;
};

const setSubmitting = (isSubmitting) => {
  if (!submitButton) return;
  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting ? '送信中…' : '送信する';
};

const setFieldError = (name, message) => {
  const error = form?.querySelector(`[data-error-for="${name}"]`);
  const field = form?.elements?.[name];
  if (error) error.textContent = message;

  if (name === 'course') {
    form?.querySelector('[data-radio-group]')?.classList.toggle('is-invalid', Boolean(message));
    return;
  }

  field?.classList?.toggle('is-invalid', Boolean(message));
};

const validateContactForm = () => {
  if (!form) return false;

  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const course = String(data.get('course') || '').trim();
  const message = String(data.get('message') || '').trim();
  let isValid = true;

  ['name', 'email', 'course', 'message'].forEach((name) => setFieldError(name, ''));

  if (!name) {
    setFieldError('name', 'お名前を入力してください。');
    isValid = false;
  }

  if (!email) {
    setFieldError('email', 'メールアドレスを入力してください。');
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError('email', 'メールアドレスの形式を確認してください。');
    isValid = false;
  }

  if (!course) {
    setFieldError('course', '希望コースを選択してください。');
    isValid = false;
  }

  if (!message) {
    setFieldError('message', '相談内容を入力してください。');
    isValid = false;
  }

  if (!isValid) {
    setFormMessage('未入力または形式が違う項目があります。赤いメッセージをご確認ください。', 'error');
    form.querySelector('.is-invalid, [data-radio-group].is-invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return isValid;
};

const buildGoogleFormBody = (formData) => {
  const body = new URLSearchParams();
  const { entryIds, sentinelIds } = GOOGLE_FORM_CONFIG;

  body.append(entryIds.name, String(formData.get('name') || '').trim());
  body.append(entryIds.email, String(formData.get('email') || '').trim());
  body.append(entryIds.message, String(formData.get('message') || '').trim());
  body.append(entryIds.course, String(formData.get('course') || '').trim());
  if (sentinelIds?.course) body.append(sentinelIds.course, '');

  return body;
};

form?.querySelectorAll('input, textarea').forEach((field) => {
  const clear = () => {
    setFieldError(field.name, '');
    setFormMessage('');
  };
  field.addEventListener('input', clear);
  field.addEventListener('change', clear);
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!validateContactForm()) return;

  if (!isGoogleFormConfigured()) {
    setFormMessage('Googleフォーム連携が未設定です。script.js の GOOGLE_FORM_CONFIG を設定してください。', 'error');
    return;
  }

  try {
    setSubmitting(true);
    setFormMessage('送信しています…', 'info');

    await fetch(GOOGLE_FORM_CONFIG.url, {
      method: 'POST',
      mode: 'no-cors',
      body: buildGoogleFormBody(new FormData(form)),
    });

    setFormMessage('送信しました。内容を確認し、折り返しご連絡します。', 'success');
    form.reset();
  } catch (error) {
    console.error('Googleフォーム送信エラー:', error);
    setFormMessage('送信できませんでした。時間をおいてもう一度お試しください。', 'error');
  } finally {
    setSubmitting(false);
  }
});

const updateHeaderShadow = () => {
  if (!header) return;
  header.style.boxShadow = window.scrollY > 8 ? '0 10px 30px rgba(9,62,130,.10)' : 'none';
};
window.addEventListener('scroll', updateHeaderShadow);
updateHeaderShadow();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
