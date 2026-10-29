(() => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const HCAPTCHA_SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2"; // gitleaks:allow herkese açık site anahtarı (Web3Forms ücretsiz plan)
  const lang = document.documentElement.lang === "en" ? "en" : "tr";
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector(".contact-form__status");
  const captchaBox = form.querySelector(".contact-form__captcha");
  const texts = {
    tr: {
      verifying: "Güvenlik doğrulaması yapılıyor…",
      sending: "Gönderiliyor…",
      success: "Teşekkürler, mesajınız iletildi. En kısa sürede dönüş yapacağım.",
      error: "Mesajınız gönderilemedi. Lütfen biraz sonra yeniden deneyin.",
      captcha: "Güvenlik doğrulaması tamamlanmadı. Lütfen yeniden deneyin.",
      required: "Lütfen bu alanı doldurun.",
      email: "Lütfen geçerli bir e-posta adresi girin.",
      consent: "Mesajınızın iletilebilmesi için bu onayı vermeniz gerekir.",
    },
    en: {
      verifying: "Running a quick security check…",
      sending: "Sending…",
      success: "Thank you, your message has been sent. I will get back to you as soon as possible.",
      error: "Your message could not be sent. Please try again later.",
      captcha: "The security check was not completed. Please try again.",
      required: "Please fill out this field.",
      email: "Please enter a valid email address.",
      consent: "Your consent is required to send your message.",
    },
  };
  const text = texts[lang];

  const validationMessageFor = (field) => {
    if (field.validity.valueMissing) return field.type === "checkbox" ? text.consent : text.required;
    if (field.validity.typeMismatch) return text.email;
    return "";
  };

  const setStatus = (state) => {
    status.dataset.state = state;
    status.textContent = text[state];
  };

  let captchaWidget = null;
  let captchaReady = null;

  const injectCaptchaScript = () => new Promise((resolve, reject) => {
    window.contactFormCaptchaLoaded = resolve;
    const script = document.createElement("script");
    script.src = `https://js.hcaptcha.com/1/api.js?render=explicit&recaptchacompat=off&onload=contactFormCaptchaLoaded&hl=${lang}`;
    script.async = true;
    script.onerror = () => reject(new Error("hCaptcha script could not be loaded"));
    document.head.appendChild(script);
  });

  // hCaptcha ilk gönderimde yüklenir: ziyaretçi verisi ancak onay kutusu işaretlendikten sonra hCaptcha'ya gider.
  const loadCaptcha = () => {
    captchaReady ??= (window.hcaptcha ? Promise.resolve() : injectCaptchaScript())
      .then(() => {
        captchaWidget = window.hcaptcha.render(captchaBox, {
          sitekey: HCAPTCHA_SITEKEY,
          size: "invisible",
          theme: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
        });
      })
      .catch((error) => {
        captchaReady = null;
        throw error;
      });
    return captchaReady;
  };

  const solveCaptcha = async () => {
    await loadCaptcha();
    const { response } = await window.hcaptcha.execute(captchaWidget, { async: true });
    return response;
  };

  // Doğrulama uyarısı tarayıcının dilinde değil, sayfanın dilinde çıksın.
  form.addEventListener("invalid", (event) => {
    const field = event.target;
    field.setCustomValidity("");
    field.setCustomValidity(validationMessageFor(field));
  }, true);

  form.addEventListener("input", (event) => event.target.setCustomValidity(""));

  // JS kapalıysa form doğrudan Web3Forms'a POST eder; hCaptcha açıkken bu yol reddedilir.
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    button.disabled = true;
    setStatus("verifying");

    let token;
    try {
      token = await solveCaptcha();
    } catch (error) {
      console.error("hCaptcha check failed:", error);
      setStatus("captcha");
      button.disabled = false;
      return;
    }

    setStatus("sending");
    try {
      const data = Object.fromEntries(new FormData(form));
      data["h-captcha-response"] = token;
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout?.(15000),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      form.reset();
      setStatus("success");
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setStatus("error");
    } finally {
      window.hcaptcha.reset(captchaWidget);
      button.disabled = false;
    }
  });
})();
