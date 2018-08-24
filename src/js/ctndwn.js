function SplitFlap (options) {
  let {container,mode,countDown,reverseAnimation=false,flapColor="255,255,255",textColor="70,70,70",text,speed=1000,textResume=2500,viewportWidth = "100vw"} = options;

  const validModes = ["text","countdown","clock"];
  const defaultFlapColor = "255,255,255";
  const defaultTextColor = "70,70,70";
  const defaultSpeed = 1000;
  const defaultTextResume = 2500;
  mode = mode.toLowerCase();

  if (!container || !container.nodeName)
    return console.error("SplitFlap: Could not locate container element in DOM.");
  else
    container.classList.add("sf-container");

  if (validModes.indexOf(mode) == -1)
    return console.error("SplitFlap: Invalid mode. Use 'text', 'clock', 'countdown'.");

  if (text && text.length == 1)
    return console.error("SplitFlap: text field needs more than 1 entry");

  if (!flapColor.split(",").every(num => Number(num) >= 0 && Number(num) <= 255))
    console.error("SplitFlap: flapColor must be RGB value (0-255). Value was reset to '255,255,255'."),
      flapColor = defaultFlapColor;

  if (!textColor.split(",").every(num => Number(num) >= 0 && Number(num) <= 255))
    console.error("SplitFlap: textColor must be RGB value (0-255). Value was reset to '255,255,255'."),
      textColor = defaultTextColor;

  if (!Number(speed > 0))
    console.error("SplitFlap: speed must be greater than 0. Value was reset to 1000ms."),
      speed = defaultSpeed;

  if (!Number(textResume > 0))
    console.log("SplitFlap: textResume must be greater than 0. Value was reset to 2500ms."),
      textResume = defaultTextResume;

  (function (c,m,cd,r,bgRGB,fontRGB,t,s,tr, vw){

    ///////////////////////////////////////////////////
    // variables
    let time, previousSecond,
      mode = m,
      countDownDate = cd,
      reverseAnimation = r,
      bgColor = bgRGB,
      fontColor = fontRGB,
      segments = 10,
      viewportWidth = vw,
      speed = s,
      text = t,
      tempText = "",
      textResume = tr,

      html = "",
      container = c,
      splitFlaps = [];

    updateMode();
    updateHTML();
    updateCSS();

    let runText, runTime;

    mode == "text" ? runText = setInterval(updateText,s) : runTime = setInterval(updateTime,1000);

    ////////////////////////////////////////////
    // HTML functions
    function updateHTML() {
      for (var x = 0; x < segments-2; x++) {
        html +=
          `<div class="splitflap">
            <div class="front-top"></div>
            <div class="front-full"></div>
            <div class="back-top"></div>
            <div class="back-full"></div>
          </div>
        `
        ; }
      container.innerHTML = html;

      document.querySelectorAll(".splitflap").forEach(element => {
        let array = element.querySelectorAll("div");
        splitFlaps.push(array);
      });
    }
    ////////////////////////////////////////////
    function updateCSS(){

      let style = {
        "rgb":  bgColor,
        "speed":  s + "ms",
        "width":  viewportWidth,
        "margin":  mode == "text" ? 0 : 1,
        "segments":  segments,
        "fontColor":  fontColor,
        "animationDirection": reverseAnimation ? "reverse" : "normal" };

      Object.entries(style).forEach(s => {
        document.documentElement.style.setProperty(`--sf-${s[0]}`, s[1]);
      });
    }
    ///////////////////////////////////////////
    function updateMode(){
      switch (mode) {
        case "countdown":
          segments = 10;
          break;
        case "clock":
          segments = 8;
          break;
        case "text":
          let length = text.reduce((a, b) => a.length > b.length ? a : b, '').length;
          segments = length + 2;
          text = text.map(text => {
            text = text.toUpperCase();
            text += " ".repeat(length-text.length)
            return text;
          });
          tempText = text[0].split("").fill("  ");
          break;
      }
    }
    ///////////////////////////////////////////
    function updateTime() {
      time = separateIntoSingleDigits(currentTimeLeft());

      setTimeout(() => {
        if (previousSecond !== time[time.length-1] || mode =="clock")
          time.forEach((num, i) => doSplitflap(splitFlaps[i], num)),
            previousSecond = time[time.length-1];
      },100);
    }
    ///////////////////////////////////////////
    function updateText() {
      if (tempText.every(matchesNextWordChar))
        clearInterval(runText),
          text.push(text.shift()),
          setTimeout(() => runText = setInterval(updateText,s),textResume);

      else
        tempText.forEach((char,i) => {
          if (!matchesNextWordChar(char,i))
            tempText[i] = nextChar(char),
              doSplitflap(splitFlaps[i],tempText[i]);
        });
    }
    ///////////////////////////////////////////
    function matchesNextWordChar(char,i){
      return (tempText[i] == text[1][i]);
    }
    ///////////////////////////////////////////
    function nextChar(c) {
      char = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ' '];
      let charIndex = char.indexOf(c);

      if (charIndex == char.length - 1) return char[0];
      else return char[charIndex + 1];
    }
    ///////////////////////////////////////////
    let currentTimeLeft = function() {
      let now = new Date(), distance = countDownDate - now;

      if (mode == "clock")
        return [
          //now.getDate(),
          now.getHours(),
          now.getMinutes(),
          now.getSeconds()
        ];

      let days = Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(runTime);
        return ["Co", "mp", "le", "te"]; }
      else {
        return [days, hours, minutes, seconds];
      }
    }
    ///////////////////////////////////////////
    function separateIntoSingleDigits(time) {
      return time
        .map(num => ("0" + num.toString()).slice(-2)) // add 0 to single digit
        .join("")
        .split("");
    }
    ///////////////////////////////////////////
    function doSplitflap(splitflapGroup, num) {
      const [frontTop, frontFull, backTop, backFull] = splitflapGroup;

      if (reverseAnimation)
        flapDirection(backTop,frontTop,backFull,frontFull)
      else
        flapDirection(frontTop,backTop,frontFull,backFull)
      ///////////////////////////////////////////
      function flapDirection(top1,top2,full1,full2){
        if (num !== top1.innerHTML) {
          top1.innerHTML = full1.innerHTML = top2.innerHTML,
            top2.innerHTML = full2.innerHTML = num;

          if (num !== top1.innerHTML)
            animate(frontFull,"flip1"), animate(backTop,"flip2");
        }
      }
    }
    ///////////////////////////////////////////
    function animate(el, cssClass) {
      el.classList.remove(cssClass);
      el.offsetWidth = el.offsetWidth;
      el.classList.add(cssClass);
    }

  }(container,mode,countDown,reverseAnimation,flapColor,textColor,text,speed,textResume,viewportWidth))
}
