
function setCookie(cname, cvalue, exhours) {
  const d = new Date();
  d.setTime(d.getTime() + (30 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length);
    }
  }
  return "";
}

function deleteCookie(cname) {
  const d = new Date();
  d.setTime(d.getTime() - 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${cname}=;${expires};path=/`;
}

function getFormAction(form, type) {
  const config = window.TRAVLLA_FORMS || {};
  if (config[type]) {
    return config[type];
  }
  return form.getAttribute('action') || '';
}

function showFormMessage(container, message, isSuccess) {
  if (!container) return;

  const alertClass = isSuccess ? 'alert-success' : 'alert-danger';
  container.innerHTML = `<div class="gen alert dz-alert ${alertClass}">${message}</div>`;

  setTimeout(() => {
    const alert = container.querySelector('.alert');
    if (alert) alert.style.display = 'none';
  }, 5000);
}

function submitToFormspree(form, msgContainer, onComplete) {
  const actionUrl = form.getAttribute('action');

  if (!actionUrl || actionUrl.includes('YOUR_')) {
    showFormMessage(
      msgContainer,
      'Form is not configured yet. Add your Formspree form ID in assets/js/form-config.js.',
      false
    );
    if (onComplete) onComplete();
    return;
  }

  if (msgContainer) {
    msgContainer.innerHTML = '<div class="gen alert dz-alert alert-success">Submitting..</div>';
  }

  fetch(actionUrl, {
    method: 'POST',
    body: new FormData(form),
    headers: { Accept: 'application/json' }
  })
    .then(response => response.json().then(data => ({ ok: response.ok, data })))
    .then(({ ok, data }) => {
      if (ok) {
        showFormMessage(msgContainer, 'Thank you! Your message has been sent.', true);
        form.reset();
      } else {
        const errorMessage = data.error || data.errors?.[0]?.message || 'Something went wrong. Please try again.';
        showFormMessage(msgContainer, errorMessage, false);
      }
    })
    .catch(() => {
      showFormMessage(msgContainer, 'Unable to send your message. Please try again later.', false);
    })
    .finally(() => {
      if (onComplete) onComplete();
    });
}

/* ----------------------------
   Contact & Subscription Forms
----------------------------- */
function contactForm() {
  const formsConfig = window.TRAVLLA_FORMS || {};

  document.querySelectorAll('.dzForm').forEach(form => {
    if (formsConfig.contact) {
      form.setAttribute('action', formsConfig.contact);
    }
    form.setAttribute('method', 'POST');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitToFormspree(form, form.querySelector('.dzFormMsg'));
    });
  });

  document.querySelectorAll('.dzSubscribe').forEach(form => {
    if (formsConfig.newsletter) {
      form.setAttribute('action', formsConfig.newsletter);
    }
    form.setAttribute('method', 'POST');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const msgContainer = form.querySelector('.dzSubscribeMsg') || document.querySelector('.dzSubscribeMsg');
      form.classList.add('dz-ajax-overlay');

      submitToFormspree(form, msgContainer, () => {
        form.classList.remove('dz-ajax-overlay');
        if (msgContainer && msgContainer.querySelector('.alert-success')) {
          setCookie('prevent_subscription', 'true', 1);
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  contactForm();
});
