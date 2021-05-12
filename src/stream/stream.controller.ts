import { Controller, Get, Header, Param, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('stream')
@UseGuards(AuthGuard())
export class StreamController {
    @Get('/:trackpath')
    @Header('Cache-Control', 'max-age=31536000')
    seeUploadedFile(@Param('trackpath') track, @Res() res) {
    return res.sendFile(track, { root: './files' });
  }
}

