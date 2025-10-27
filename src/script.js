const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let frames = 0;
let prevTimestamp = 0;
const DEGREE = Math.PI / 180;

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
  dx: 2,

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

  update: function (delta) {
    if (state.current === state.game) {
      this.x = (this.x - this.dx * delta) % (this.w / 2);
    }
  },
};

const score = {
  best: parseInt(localStorage.getItem("best")) || 0,
  current: 0,

  draw: function () {
    context.fillStyle = "#FFF";
    context.strokeStyle = "#000";
    if (state.current === state.game) {
      context.lineWidth = 2;
      context.font = "35px Teko";
      context.fillText(this.current, canvas.width / 2, 50);
      context.strokeText(this.current, canvas.width / 2, 50);
    } else if (state.current === state.over) {
      context.font = "25px Teko";
      context.fillText(this.current, 225, 186);
      context.strokeText(this.current, 225, 186);
      context.fillText(this.best, 225, 228);
      context.strokeText(this.best, 225, 228);
    }
  },

  reset: function () {
    this.current = 0;
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
  speed: 0,
  gravity: 0.25,
  radius: 12,
  jump: 4.6,
  rotation: 0,
  period: 0,
  animationTimer: 0,

  draw: function () {
    let bird = this.animation[this.frame];
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.drawImage(
      sprite,
      bird.sX,
      bird.sY,
      this.w,
      this.h,
      -this.w / 2,
      -this.h / 2,
      this.w,
      this.h
    );
    context.restore();
  },

  flap: function () {
    this.speed = -this.jump;
  },

  update: function(diff) {
    const delta = diff / (1000 / 60);

    if (state.current === state.getReady) {

      if (!this.getReadyTimer) this.getReadyTimer = 0;
      this.getReadyTimer += diff;

      if (this.getReadyTimer > 200) {
        this.frame = (this.frame + 1) % this.animation.length;
        this.getReadyTimer = 0;
      }

      this.y = 150;
      this.speed = 0;
      this.rotation = 0;
    } else {
      this.animationTimer += diff;

      if (this.animationTimer > 100) {
        this.frame = (this.frame + 1) % this.animation.length;
        this.animationTimer = 0;
      }

      this.speed += this.gravity * delta;
      this.y += this.speed * delta;

      if (this.y + this.h / 2 >= canvas.height - fg.h) {
        this.y = canvas.height - fg.h - this.h / 2;

        if (state.current === state.game) {
          state.current = state.over;
          dieAudio.play();
        }
      }

      if (this.speed >= this.jump) {
        this.rotation = 90 * DEGREE;
        this.frame = 1;
      } else {
        this.rotation = -25 * DEGREE;
      }
    }
  },

  speedReset: function () {
    this.speed = 0;
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
    if (state.current === state.getReady) {
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
    }
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
    if (state.current === state.over) {
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
    }
  },
};

const startBtn = {
  x: 120,
  y: 263,
  w: 83,
  h: 29,
};

const state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2,
};

const pipes = {
  position: [],
  bottom: {
    sX: 502,
    sY: 0,
  },
  top: {
    sX: 553,
    sY: 0,
  },
  w: 53,
  h: 400,
  gap: 85,
  dx: 2,

  maxYPos: -150,
  spawnTimer: 0,
  spawnInterval: 1500,

  draw: function () {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let topYPos = p.y;
      let bottomYPos = p.y + this.gap + this.h;

      context.drawImage(
        sprite,
        this.top.sX,
        this.top.sY,
        this.w,
        this.h,
        p.x,
        topYPos,
        this.w,
        this.h
      );

      context.drawImage(
        sprite,
        this.bottom.sX,
        this.bottom.sY,
        this.w,
        this.h,
        p.x,
        bottomYPos,
        this.w,
        this.h
      );
    }
  },

  update: function (delta) {
    if (state.current !== state.game) return;

    this.spawnTimer += delta * (1000 / 60);

    if (this.spawnTimer >= this.spawnInterval) {
      this.position.push({
        x: canvas.width,
        y: this.maxYPos * (Math.random() + 1),
      });
      this.spawnTimer = 0;
    }

    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];

      let bottomPipeY = p.y + this.gap + this.h;

      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > p.y &&
        bird.y - bird.radius < p.y + this.h
      ) {
        hitAudio.play();
        state.current = state.over;
      }

      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > bottomPipeY &&
        bird.y + bird.radius < bottomPipeY + this.h
      ) {
        hitAudio.play();
        state.current = state.over;
      }

      p.x -= this.dx * delta;

      if (p.x + this.w <= 0) {
        this.position.shift();
        score.current += 1;
        scoreAudio.play();
        score.best = Math.max(score.current, score.best);
        localStorage.setItem("best", score.best);
      }
    }
  },

  reset: function () {
    this.position = [];
    this.spawnTimer = 0;
  },
};

function onClick(event) {
  switch (state.current) {
    case state.getReady:
      state.current = state.game;
      startAudio.play();
      break;

    case state.game:
      bird.flap();
      flyAudio.play();
      flyAudio.pause();
      flyAudio.currentTime = 0;
      flyAudio.play();
      break;

    case state.over:
      const rect = canvas.getBoundingClientRect();
      let clickX = event.clientX - rect.left;
      let clickY = event.clientY - rect.top;
      if (
        clickX >= startBtn.x &&
        clickX <= startBtn.x + startBtn.w &&
        clickY >= startBtn.y &&
        clickY <= startBtn.y + startBtn.h
      ) {
        bird.speedReset();
        pipes.reset();
        score.reset();
        state.current = state.getReady;
      }

      break;
  }
}

canvas.addEventListener("click", onClick);

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

function draw() {
  context.fillStyle = "#70c5ce";
  context.fillRect(0, 0, canvas.width, canvas.height);
  bg.draw();
  pipes.draw();
  fg.draw();
  bird.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();
}

function update(diff) {
  bird.update(diff);
  const delta = diff / (1000 / 60);
  fg.update(delta);
  pipes.update(delta);
}

function loop(timestamp) {
  const diff = timestamp - prevTimestamp;
  prevTimestamp = timestamp;
  update(diff);
  draw();
  frames++;
  requestAnimationFrame(loop);
}

loop();
