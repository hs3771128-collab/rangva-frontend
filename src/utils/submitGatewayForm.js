/**
 * Hands the browser over to a hosted payment page.
 *
 * The backend returns a signed set of fields, and the gateway only accepts them
 * as a POST body, so a hidden form is built and submitted here.
 */
const submitGatewayForm = (redirectUrl, fields) => {
  if (!redirectUrl) {
    throw new Error("Payment gateway URL missing");
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = redirectUrl;
  form.style.display = "none";

  Object.entries(fields || {}).forEach(([name, value]) => {
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
