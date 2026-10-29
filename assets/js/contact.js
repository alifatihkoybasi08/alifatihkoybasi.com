(() => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector(".contact-form__status");
  const messages = {
    sending: "Gönderiliyor…",
    success: "Teşekkürler, mesajınız iletildi. En kısa sürede dönüş yapacağım.",
    error: "Mesajınız gönderilemedi. Lütfen biraz sonra yeniden deneyin.",
  };

  const validationMessageFor = (field) => {
    if (field.validity.valueMissing) {
      return field.type === "checkbox"
        ? "Mesajınızın iletilebilmesi için bu onayı vermeniz gerekir."
        : "Lütfen bu alanı doldurun.";
    }
    if (field.validity.typeMismatch) return "Lütfen geçerli bir e-posta adresi girin.";
    return "";
  };

  const setStatus = (state) => {
    status.dataset.state = state;
    status.textContent = messages[state];
  };

  // Doğrulama uyarısı tarayıcının dilinde değil, sayfanın dilinde (Türkçe) çıksın.
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
      console.error("İletişim formu gönderilemedi:", error);
      setStatus("error");
    } finally {
      button.disabled = false;
    }
  });
})();
