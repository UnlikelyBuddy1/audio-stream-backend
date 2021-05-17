import { Controller, Get, Header, Param, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { streamFileUtils } from 'src/utils/stream-track.utils';
@Controller('stream')
//@UseGuards(AuthGuard())
export class StreamController {
  
  @Get('/download/:trackpath')
  @Header('Cache-Control', 'max-age=31536000')
  giveFile(@Param('trackpath') track, @Res() res) { 
    return res.sendFile(track, { root: './files' });
  }
  
  @Get()
  sendHtml(@Res() res){
    return res.sendFile('index.html', { root: 'C:/Users/Adri/Desktop/Pweb/code/pweb-back-dev/src/stream/' });
  }

  @Get('/:trackpath')
  streamFile(@Param('trackpath') track, @Res() response, @Request() request) { 
    return streamFileUtils(track, response, request);
  }
}

