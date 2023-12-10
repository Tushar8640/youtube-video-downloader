import * as ytdl from 'ytdl-core';
import * as stream from 'stream';
import * as cp from 'child_process';

const ytmux = (link: string, options: any = {}): stream.PassThrough => {
    const itag = 137;
    const result = new stream.PassThrough({
      highWaterMark: options.highWaterMark || 1024 * 512,
    });
  
    ytdl.getInfo(link, options).then((info: ytdl.videoInfo) => {
      let audioStream: stream.Readable | null = ytdl.downloadFromInfo(info, {
        ...options,
        quality: 'highestaudio',
      });
  
      console.log(info.formats);
      const format = info.formats.find((item) => item.itag === itag);
  
      let videoStream: stream.Readable | null = ytdl.downloadFromInfo(info, {
        ...options,
        format,
      });
  
      // create the ffmpeg process for muxing
      const ffmpegProcess = cp.spawn(
        'ffmpeg',
        [
          // suppress non-crucial messages
          '-loglevel',
          '8',
          '-hide_banner',
          // input audio and video by pipe
          '-i',
          'pipe:3',
          '-i',
          'pipe:4',
          // map audio and video correspondingly
          '-map',
          '0:a',
          '-map',
          '1:v',
          // no need to change the codec
          '-c',
          'copy',
          // output mp4 and pipe
          '-f',
          'matroska',
          'pipe:5',
        ],
        {
          // no popup window for Windows users
          windowsHide: true,
          stdio: [
            // silence stdin/out, forward stderr,
            'inherit',
            'inherit',
            'inherit',
            // and pipe audio, video, output
            'pipe',
            'pipe',
            'pipe',
          ],
        }
      );
  
      // Check if streams are not null before piping
      if (audioStream && videoStream) {
        audioStream.pipe(ffmpegProcess.stdin!);
        videoStream.pipe(ffmpegProcess.stdin!);
        ffmpegProcess.stdout!.pipe(result);
      } else {
        console.error('Error: Audio or video stream is null.');
      }
    });
  
    return result;
  };
  
  // export it
  export default ytmux;