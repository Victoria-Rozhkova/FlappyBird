const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let frames = 0;

const sprite = new Image();
sprite.src = "./img/sprite.png";

const bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: canvas.height - 226,
  draw: function () {
    context.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    context.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
};

const fg = {
  sX: 276,
  sY: 0,
  w: 224,
  h: 112,
  x: 0,
  y: canvas.height - 112,
  draw: function () {
    context.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    context.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
};

const bird = {
  animation: [
    { sX: 276, sY: 112 },
    { sX: 276, sY: 139 },
    { sX: 276, sY: 164 },
    { sX: 276, sY: 139 },
  ],
  w: 34,
  h: 26,
  x: 50,
  y: 150,
  frame: 0,
  draw: function () {
    let bird = this.animation[this.frame];
    context.drawImage(
      sprite,
      bird.sX,
      bird.sY,
      this.w,
      this.h,
      this.x - this.w / 2,
      this.y - this.h / 2,
      this.w,
      this.h
    );
    // context.drawImage(
    //   sprite,
    //   this.sX,
    //   this.sY,
    //   this.w,
    //   this.h,
    //   this.x + this.w,
    //   this.y,
    //   this.w,
    //   this.h
    // );
  },
};

const getReady = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: canvas.width / 2 - 173 / 2,
  y: 80,
  draw: function () {
    context.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
  },
};

const gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: canvas.width / 2 - 225 / 2,
  y: 90,
  draw: function () {
    context.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
  },
};

const startAudio = new Audio();
const flyAudio = new Audio();
const scoreAudio = new Audio();
const dieAudio = new Audio();
const hitAudio = new Audio();

startAudio.src = "./audio/start.wav";
flyAudio.src = "./audio/flap.wav";
scoreAudio.src = "./audio/score.wav";
dieAudio.src = "./audio/die.wav";
hitAudio.src = "./audio/hit.wav";

let score = 0;

const gap = 90;

let grav = 1.5;

function draw() {
  context.fillStyle = "#70c5ce";
  context.fillRect(0, 0, canvas.width, canvas.height);
  bg.draw();
  fg.draw();
}

function update() {}

function loop() {
  // update();
  draw();
  frames++;
  requestAnimationFrame(loop);
}
loop();