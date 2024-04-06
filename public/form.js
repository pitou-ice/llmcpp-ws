window.addEventListener('load', form);

function form() {
  const form = document.forms.form;
  var ws = new WebSocket(`ws://${location.host}`);

  ws.addEventListener('open', () => console.log('WebSocket Opened'));
  ws.addEventListener('close', () => console.log('WebSocket Closed'));
  // TODO binary handler
  var currP;
  ws.addEventListener('message', readBinaryData);

  form.onsubmit = () => {
    const prompt = form.stdin.value;
    if (prompt) {
      form.stdin.value = '';

      addP(prompt, 'user-msg');

      ws.send(prompt);
    }
    return false;
  };

  function readData({ data }) {
    data = data
      .replace(/.*<\|im_start\|>.*/g, '')
      .replace(/<.*>/g, '')
      .replace(/^>\s/g, '');
    if (data) addP(data, 'bot-msg');
  }

  function readBinaryData({ data }) {
    data.text().then((text) => {
      if (text.includes('<|im_start|>')) return;
      if (text.trim().startsWith('>')) return;
      if (text === '�' || isEmoji(text)) return;

      if (text.includes('<|im_end|>')) {
        currP = undefined;
        return;
      }
      if (currP == undefined) {
        currP = document.createElement('p');
        currP.className = 'bot-msg';
        form.stdout.appendChild(currP);
      }

      currP.textContent += text;
      form.stdout.scrollTop = form.stdout.scrollHeight;
    });
  }

  function addP(text, className) {
    const p = document.createElement('p');
    p.className = className;
    p.textContent = text;
    form.stdout.appendChild(p);
    form.stdout.scrollTop = form.stdout.scrollHeight;
  }

  function isEmoji(character) {
    const emojiRegex =
      /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    return emojiRegex.test(character);
  }
}
