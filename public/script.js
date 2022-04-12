try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch (e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}

var noteTextarea = $('#note-textarea');
var noteContent = '';

/*-----------------------------
      Voice Recognition 
------------------------------*/

/*  Kayıt başlatılıp bir kaç saniye sessiz kalınırsa duracaktır, konuşmaya başlanırsa bu süre yaklaşık 15 saniyedir. 
Kullanıcı duraksasa bile kayda devam etmemizi sağlar.*/

recognition.continuous = true;
recognition.lang = "tr";

recognition.onresult = function (event) {

  var current = event.resultIndex;

  // Söylenenleri dökümante eder.
  var transcript = event.results[current][0].transcript;

  // Notumuzu texte yazar.
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if (!mobileRepeatBug) {
    noteContent += transcript;
    noteTextarea.val(noteContent);
  }
};

recognition.onstart = function () {
};

recognition.onspeechend = function () {
};

recognition.onerror = function (event) {
  if (event.error == 'no-speech') {
  };
};

/*--------------------------------------------
      Uygulama buton ve input kontrolleri
---------------------------------------------*/

$('#record').on('click', function (e) {
  if (noteContent.length) {
    noteContent += ' ';
  }
  recognition.start();

});

$('#stop').on('click', function (e) {
  recognition.stop();
});

$('#kaydet').on('click', function (e) {
  DurdurKaydet();
});

$('#vazgec').on('click', function (e) {
  VazgecKaydet();
});

//Durdur buton fonksiyonu
function DurdurKaydet() {
  const params =
  {
    Sonuc: "DurdurAction"
  }
  const http = new XMLHttpRequest()
  http.open('POST', 'http://localhost:3000/dur/')
  http.setRequestHeader('Content-type', 'application/json')
  http.send(JSON.stringify(params))
}

//Vazgeç buton fonksiyonu
function VazgecKaydet() {
  const params =
  {
    Sonuc: "IptalAction"
  }
  const http = new XMLHttpRequest()
  http.open('POST', 'http://localhost:3000/iptal/')
  http.setRequestHeader('Content-type', 'application/json')
  http.send(JSON.stringify(params))
}

// Metin alanındaki değişkeni noteContent içerisine al.
noteTextarea.on('input', function () {
  noteContent = $(this).val();
});

/*-----------------------------
      Konuşma Sentezi
------------------------------*/

function readOutLoud(message) {
  var speech = new SpeechSynthesisUtterance();

  // Metin ve ses özellikleri
  speech.text = message;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}