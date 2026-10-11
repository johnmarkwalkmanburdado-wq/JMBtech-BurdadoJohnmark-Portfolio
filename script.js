(() => {
  'use strict';

  const RECIPIENT_EMAIL = 'johnmarklacadmanburdado@gmail.com';
  const TYPING_SPEED_MS = 35;

  function typeIntro() {
    const intro = document.querySelector('.intro');
    if (!intro) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const parts = Array.from(intro.childNodes).map((node) => ({
      tag: node.nodeType === Node.ELEMENT_NODE ? node.tagName.toLowerCase() : null,
      text: node.textContent.replace(/\s+/g, ' ')
    }));

    intro.style.minHeight = `${intro.offsetHeight}px`;
    intro.textContent = '';
    intro.classList.add('typing');

    const characters = [];
    parts.forEach(({ tag, text }) => {
      const holder = tag
        ? intro.appendChild(document.createElement(tag))
        : intro.appendChild(document.createTextNode(''));
      Array.from(text).forEach((char) => characters.push({ holder, char }));
    });

    let position = 0;
    const timer = setInterval(() => {
      if (position >= characters.length) {
        clearInterval(timer);
        intro.classList.remove('typing');
        intro.style.minHeight = '';
        return;
      }
      const { holder, char } = characters[position++];
      holder.textContent += char;
    }, TYPING_SPEED_MS);
  }

  function setupContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form || !status) return;

    form.addEventListener('submit', async (event) => {
      if (window.location.protocol === 'file:') return;

      event.preventDefault();

      const button = form.querySelector('button[type="submit"]');
      const buttonText = button.textContent;
      button.disabled = true;
      button.textContent = 'Sending...';
      status.textContent = 'Sending your message...';

      try {
        const ajaxUrl = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
        const response = await fetch(ajaxUrl, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        const result = await response.json();

        if (!response.ok || String(result.success) !== 'true') {
          throw new Error(result.message || 'The message could not be sent.');
        }

        status.textContent = 'Thank you! Your message has been sent successfully.';
        form.reset();
      } catch (error) {
        status.textContent = `Sorry, your message was not sent. Please try again later or email ${RECIPIENT_EMAIL} directly.`;
      } finally {
        button.disabled = false;
        button.textContent = buttonText;
      }
    });
  }

  typeIntro();
  setupContactForm();
})();
