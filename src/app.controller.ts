import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Cache-Control', 'max-age=31536000')
  givePage(@Res() res) { 
    return res.sendFile('Kset.html', { root: './front/' });
  }

  @Get('/assets/:asset')
  @Header('Cache-Control', 'max-age=31536000')
  getAsset(@Param('asset') asset, @Res() res) { 
    return res.sendFile(asset, { root: './front/assets' });
  }
}
