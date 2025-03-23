// 1. Toggle Menu on Click
document.querySelector('.menu-icon').addEventListener('click', function () {
  const menu = document.querySelector('.menu');
  menu.classList.toggle('open');
  console.log('Menu toggled. Open class applied:', menu.classList.contains('open'));
});

// 2. Close Menu When Clicking Outside
document.addEventListener('click', function (event) {
  const menu = document.querySelector('.menu');
  const menuIcon = document.querySelector('.menu-icon');
  if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
    menu.classList.remove('open');
    console.log('Menu closed. Open class removed.');
  }
});

// 3. File Upload for Image and Video
document.getElementById('file-upload').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const output = document.getElementById('output');
    output.innerHTML = '';

    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.style.maxWidth = '100%';
      output.appendChild(img);
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.controls = true;
      video.style.maxWidth = '100%';
      output.appendChild(video);
    } else {
      output.innerHTML = '<p>Unsupported file type. Please upload an image or video.</p>';
    }
  }
});

// 4. Text to Image (Hugging Face API)
async function generateImageFromText(text) {
  const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer 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',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inputs: text })
  });
  const result = await response.json();
  return result;
}

document.getElementById('generate-button').addEventListener('click', function () {
  const text = document.getElementById('text-input').value;
  if (text.trim() === '') {
    alert('Please enter some text.');
    return;
  }

  generateImageFromText(text).then((data) => {
    const img = document.createElement('img');
    img.src = data.image_url;
    document.getElementById('output-image').appendChild(img);
  });
});

// 5. Text to Speech (Web Speech API)
document.getElementById('speak-button').addEventListener('click', function () {
  const text = document.getElementById('text-input').value;
  const audioOutput = document.getElementById('audio-output');

  if (text.trim() === '') {
    alert('Please enter some text.');
    return;
  }

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.voice = synth.getVoices().find(voice => voice.lang === 'en-US');
  synth.speak(utterance);

  audioOutput.style.display = 'block';
});
