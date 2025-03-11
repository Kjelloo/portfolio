import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';
import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
