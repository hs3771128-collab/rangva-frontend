/**
 * Hands the browser over to a hosted payment page.
 *
 * Gateways that need a signed POST (JazzCash, Easypaisa) get a hidden form;
 * gateways that use a plain checkout URL (Safepay) are opened with a GET.
 */
const submitGatewayForm = (redirectUrl, fields) => {
  if (!redirectUrl) {
    throw new Error("Payment gateway URL missing");
  }

  const entries = Object.entries(fields || {});

  if (entries.length === 0) {
    window.location.assign(redirectUrl);
    return;
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = redirectUrl;
  form.style.display = "none";

  entries.forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value ?? "";
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

export default submitGatewayForm;
