// 用于捕获时间戳的正则

const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;

// 播放状态
enum PlayState {
  pause = 0,
  playing
}

// Tag接口
interface Tag {
  [title: string]: string | undefined;
  artist: string | undefined;
  album: string | undefined;
  offset: string | undefined;
  by: string | undefined;
}
// 返回的当前歌词
export interface Line {
  txt: string;
  lineNum: number;
}
// 歌词数组类型
interface Lines {
  time: number;
  txt: string;
}
// 捕获Tag的正则
const tagRegMap: Tag = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by'
};
// 空函数
function noop(value: Line) {}

class LyricParser {
  lrc: string;
  // tag
  tags: Tag = {
    title: undefined,
    artist: undefined,
    album: undefined,
    offset: undefined,
    by: undefined
  };
  // Line 信息数组
  lines: Array<Lines> = [];
  handler: (value: Line) => void;
  state: PlayState = PlayState.pause;
  curNum: number = 0;
  startStamp: number = 0;
  timer: number | undefined;
  pauseStamp: number | undefined;
  constructor(lrc: string, handler = noop) {
    // 歌词 string
    this.lrc = lrc;
    // 默认handler
    this.handler = handler;
    // 初始化
    this.init();
  }

  init() {
    // 初始化Tag
    this.initTag();
    // 初始化Line
    this.initLines();
  }

  initTag() {
    // 遍历tag Reg，捕获出对应的信息，存入this.tags
    for (let tag in tagRegMap) {
      const matches = this.lrc.match(
        new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i')
      );
      this.tags[tag] = (matches && matches[1]) || '';
    }
  }

  initLines() {
    // 以\n分割为数组
    const lines = this.lrc.split('\n');
    lines.forEach((line) => {
      // 捕获每行歌词的时间
      const result: RegExpExecArray | null = timeExp.exec(line);
      if (result) {
        // 提取文本
        const txt = line.replace(timeExp, '').trim();
        if (txt) {
          // 判断时间
          const min = +result[1] * 60 * 1000;
          const sec = +result[2] * 1000;
          const temp = result[3];
          const msec = temp
            ? temp.length > 2 && +temp < 100
              ? +temp
              : +temp > 99
              ? +temp
              : +temp * 10
            : 0;
          this.lines.push({
            time: min + sec + msec,
            txt
          });
        }
      }
    });
    // 按时间小到大排序
    this.lines.sort((a, b) => a.time - b.time);
  }

  findCurNum(time: number) {
    // 找到最接近传入时间的第一条歌词的LineNum
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i;
      }
    }
    // 否则返回最后一条歌词的lineNum
    return this.lines.length - 1;
  }

  // 把数据传给回调函数
  callHandler(lineNum: number) {
    if (lineNum < 0) {
      return;
    }
    this.handler({
      txt: this.lines[lineNum].txt,
      lineNum: lineNum
    });
  }

  playRest() {
    const line = this.lines[this.curNum];
    const delay = line.time - (+new Date() - this.startStamp);

    this.timer = window.setTimeout(() => {
      this.callHandler(this.curNum++);
      if (this.curNum < this.lines.length && this.state === PlayState.playing) {
        this.playRest();
      }
    }, delay);
  }

  play(startTime: number = 0, skipLast: boolean = false) {
    if (!this.lines.length) {
      return;
    }
    this.state = PlayState.playing;

    this.curNum = this.findCurNum(startTime);
    this.startStamp = +new Date() - startTime;

    if (!skipLast) {
      this.callHandler(this.curNum - 1);
    }

    if (this.curNum < this.lines.length) {
      clearTimeout(this.timer);
      this.playRest();
    }
  }

  togglePlay() {
    const now = +new Date();
    if (this.state === PlayState.playing) {
      this.stop();
      this.pauseStamp = now;
    } else {
      this.state = PlayState.playing;
      this.play((this.pauseStamp || now) - (this.startStamp || now), true);
      this.pauseStamp = 0;
    }
  }
  pause() {
    const now = +new Date();
    this.stop();
    this.pauseStamp = now;
    this.state = PlayState.pause;
  }
  continue() {
    const now = +new Date();
    this.state = PlayState.playing;
    this.play((this.pauseStamp || now) - (this.startStamp || now), true);
    this.pauseStamp = 0;
  }
  stop() {
    this.state = PlayState.pause;
    clearTimeout(this.timer);
  }

  seek(offset: number) {
    this.play(offset);
  }
}
export default LyricParser;
