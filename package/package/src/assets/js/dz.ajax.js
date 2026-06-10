
function showFormMessage(container, message, isSuccess) {
  if (!container) return;

  const alertClass = isSuccess ? 'alert-success' : 'alert-danger';
  container.innerHTML = `<div class="gen alert dz-alert ${alertClass}">${message}</div>`;

  setTimeout(() => {
    const alert = container.querySelector('.alert');
    if (alert) alert.style.display = 'none';
  }, 5000);
}

function setContactFieldState(field, isValid) {
  if (!field) return;
  field.classList.toggle('border-red-500', !isValid);
  field.classList.toggle('border-primary/20', isValid);
}

function isLocalPreview() {
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
}

function validateContactForm(form) {
  const msgContainer = form.querySelector('.dzFormMsg');
  const honeypot = form.querySelector('[name="bot-field"]');
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach((field) => setContactFieldState(field, true));

  if (honeypot && honeypot.value.trim()) {
    return false;
  }

  requiredFields.forEach((field) => {
    if (!field.checkValidity()) {
      setContactFieldState(field, false);
      isValid = false;
    }
  });

  if (!isValid) {
    showFormMessage(msgContainer, 'Please fill in all required fields.', false);
    const firstInvalid = form.querySelector('.border-red-500');
    firstInvalid?.focus();
  }

  return isValid;
}

function ensureContactSubject(form) {
  const subjectInput = form.querySelector('[name="subject"]');
  if (!subjectInput || subjectInput.value.trim()) return;

  const interest = form.querySelector('#delegation-interest')?.value || '';
  const pkg = form.querySelector('#delegation-package')?.value || '';
  const subject = window.Imusafir?.buildContactSubject?.(interest, pkg);

  if (subject) {
    subjectInput.value = subject;
  } else if (interest || pkg) {
    subjectInput.value = 'iMUSAFIR Contact Form Submission';
  }
}

function setSubmitButtonState(form, isSubmitting) {
  const button = form.querySelector('[type="submit"]');
  if (!button) return;

  button.disabled = isSubmitting;
  button.setAttribute('aria-busy', isSubmitting ? 'true' : 'false');
  if (isSubmitting) {
    button.dataset.originalText = button.textContent;
    button.textContent = 'Sending...';
  } else if (button.dataset.originalText) {
    button.textContent = button.dataset.originalText;
  }
}

function encodeNetlifyFormBody(form) {
  const formData = new FormData(form);
  const params = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    params.append(key, value);
  }

  if (!params.has('form-name') && form.getAttribute('name')) {
    params.set('form-name', form.getAttribute('name'));
  }

  return params.toString();
}

function submitToNetlify(form, msgContainer, onComplete) {
  if (isLocalPreview()) {
    showFormMessage(
      msgContainer,
      'Form submissions are processed on the live site. Test at imusafir.com/contact.html after deploying.',
      false
    );
    if (onComplete) onComplete();
    return;
  }

  if (msgContainer) {
    msgContainer.innerHTML = '<div class="gen alert dz-alert alert-success">Submitting...</div>';
  }

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeNetlifyFormBody(form)
  })
    .then((response) => {
      if (response.ok) {
        showFormMessage(msgContainer, 'Thank you! Your message has been sent. We will be in touch shortly.', true);
        form.reset();

        const subjectInput = form.querySelector('#contact-subject');
        if (subjectInput) {
          delete subjectInput.dataset.userEdited;
        }

        window.Imusafir?.applyContactFormParams?.();
        return;
      }

      throw new Error('Submission failed');
    })
    .catch(() => {
      showFormMessage(msgContainer, 'Unable to send your message. Please try again later.', false);
    })
    .finally(() => {
      if (onComplete) onComplete();
    });
}

/* ----------------------------
   Contact Forms (Netlify)
----------------------------- */
function contactForm() {
  document.querySelectorAll('.dzForm').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const msgContainer = form.querySelector('.dzFormMsg');
      if (!validateContactForm(form)) {
        return;
      }

      ensureContactSubject(form);
      setSubmitButtonState(form, true);

      submitToNetlify(form, msgContainer, () => {
        setSubmitButtonState(form, false);
      });
    });

    form.querySelectorAll('.contact-field').forEach((field) => {
      field.addEventListener('input', () => setContactFieldState(field, true));
      field.addEventListener('change', () => setContactFieldState(field, true));
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  contactForm();
});
