import axios from 'axios';
export const fetchSong = async (songId: number) => {
  const {
    data: {
      data: [currentSong]
    }
  } = await axios(`/api/music/song/url?id=${songId}`);
  const { id, url } = currentSong;
  const {
    data: {
      songs: [currentSongInfo]
    }
  } = await axios(`/api/music/song/detail?ids=${songId}`);
  const {
    name,
    al: { name: albumName, picUrl },
    ar: singer
  } = currentSongInfo;
  const {
    data: { nolyric, uncollected, lrc, tlyric }
  } = await axios(`/api/music/lyric?id=${songId}`);
  return {
    id,
    name,
    url,
    albumName,
    picUrl,
    singer,
    lyric: nolyric || uncollected ? undefined : lrc.lyric,
    translateLyric: nolyric || uncollected ? undefined : tlyric.translateLyric
  };
};
