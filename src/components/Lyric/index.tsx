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
  songId: number | undefined;
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
    if (state.current.id && state.current.id !== this.songId) {
      this.lyricControl && this.lyricControl.stop();
      this.lyricStr = state.current.lyric || '';
      this.songId = state.current.id;
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
        lyricLines: this.lyricControl.lines,
        currentLine: 0
      });
      this.linesEle = [];
      this.lyricControl.play();
      if (this.bScroll) {
        this.bScroll.scrollTo(0, 0);
        this.bScroll.refresh();
      }
    }
    if (state.isPlay !== this.isPlay && this.lyricControl) {
      this.isPlay = state.isPlay;
      this.isPlay ? this.lyricControl.continue() : this.lyricControl.pause();
    }
    const currentTime = progressChange();
    if (currentTime !== undefined && this.lyricControl) {
      this.lyricControl.seek(currentTime * 1000);
    }
  }

  render() {
    const { lyricLines, currentLine } = this.state;
    return (
      <div className={styles.lyricWrapper} ref={this.scrollRef}>
        <div className={styles.lyricScroll}>
          <div>
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
            {lyricLines.length === 0 ? (
              <p className={classNames(styles.line, styles.currentLine)}>
                暂无歌词
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Lyric;
