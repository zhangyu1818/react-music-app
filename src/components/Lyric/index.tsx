import React, { PureComponent } from 'react';
import Context from '../../context';
import classNames from 'classnames';
import styles from './index.module.scss';
import LyricParser, { Line } from '../../utils/lyricParser';
import BScroll from 'better-scroll';

interface LyricState {
  lyricLines: Array<object>;
  currentLine: number;
}
class Lyric extends PureComponent<any, LyricState> {
  scrollRef = React.createRef<HTMLDivElement>();
  lyricStr: string = '';
  lyricControl: LyricParser | null = null;
  isPlay: boolean | undefined;
  isDrag: boolean = false;
  static contextType = Context;
  linesEle: Array<HTMLParagraphElement> = [];
  state = {
    lyricLines: [],
    currentLine: 0
  };
  bScroll: BScroll | undefined;
  componentDidMount() {
    if (!this.scrollRef.current) return;
    this.bScroll = new BScroll(this.scrollRef.current);
    this.bScroll.on('scrollStart', () => {
      this.isDrag = true;
    });
    let timer: number | null = null;
    this.bScroll.on('touchEnd', () => {
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => {
        this.isDrag = false;
      }, 3000);
    });
    this.isPlay = this.context.state.isPlay;
  }
  componentDidUpdate() {
    const { state } = this.context;
    const { progressChange } = this.props;
    const currentTime = progressChange();
    if (currentTime && this.lyricControl) {
      this.lyricControl.seek(currentTime * 1000);
    }
    if (state.current.lyric && state.current.lyric !== this.lyricStr) {
      this.lyricControl && this.lyricControl.stop();
      this.lyricStr = state.current.lyric;
      this.lyricControl = new LyricParser(
        this.lyricStr,
        ({ txt, lineNum }: Line) => {
          if (!this.linesEle.length) {
            this.linesEle = Array.from(
              (this.scrollRef.current as HTMLDivElement).querySelectorAll(
                'p[data-lines]'
              )
            );
          }
          this.setState({
            currentLine: lineNum
          });
          if (!this.bScroll || this.isDrag) return;
          const currentLineEle = this.linesEle[lineNum];
          this.bScroll.scrollToElement(currentLineEle, 400, 0, true);
        }
      );
      this.setState({
        lyricLines: this.lyricControl.lines
      });
      this.linesEle = [];
      if (this.bScroll) this.bScroll.refresh();
    }
    if (state.isPlay !== this.isPlay && this.lyricControl) {
      this.isPlay = state.isPlay;
      this.isPlay ? this.lyricControl.continue() : this.lyricControl.pause();
    }
  }

  render() {
    const { lyricLines, currentLine } = this.state;
    return (
      <div className={styles.lyricWrapper} ref={this.scrollRef}>
        <div className={styles.lyricScroll}>
          {lyricLines.map(({ txt, time }, index) => (
            <p
              className={classNames(
                styles.line,
                currentLine === index ? styles.currentLine : null
              )}
              data-lines={index}
              key={time}
            >
              {txt}
            </p>
          ))}
        </div>
      </div>
    );
  }
}

export default Lyric;
