(() => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector(".contact-form__status");
  const texts = {
    tr: {
      sending: "Gönderiliyor…",
      success: "Teşekkürler, mesajınız iletildi. En kısa sürede dönüş yapacağım.",
      error: "Mesajınız gönderilemedi. Lütfen biraz sonra yeniden deneyin.",
      required: "Lütfen bu alanı doldurun.",
      email: "Lütfen geçerli bir e-posta adresi girin.",
      consent: "Mesajınızın iletilebilmesi için bu onayı vermeniz gerekir.",
    },
    en: {
      sending: "Sending…",
      success: "Thank you, your message has been sent. I will get back to you as soon as possible.",
      error: "Your message could not be sent. Please try again later.",
      required: "Please fill out this field.",
      email: "Please enter a valid email address.",
      consent: "Your consent is required to send your message.",
    },
  };
  const text = texts[document.documentElement.lang] ?? texts.tr;

  const validationMessageFor = (field) => {
    if (field.validity.valueMissing) return field.type === "checkbox" ? text.consent : text.required;
    if (field.validity.typeMismatch) return text.email;
    return "";
  };

  const setStatus = (state) => {
    status.dataset.state = state;
    status.textContent = text[state];
  };

  // Doğrulama uyarısı tarayıcının dilinde değil, sayfanın dilinde çıksın.
  form.addEventListener("invalid", (event) => {
    const field = event.target;
    field.setCustomValidity("");
    field.setCustomValidity(validationMessageFor(field));
  }, true);

  form.addEventListener("input", (event) => event.target.setCustomValidity(""));

  // JS kapalıysa form doğrudan Web3Forms'a POST eder; burası yalnız sayfada kalmayı sağlar.
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    button.disabled = true;
    setStatus("sending");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
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
      button.disabled = false;
    }
  });
})();
