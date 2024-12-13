import { Component } from '@angular/core';
import { CountdownComponent } from './countdown/countdown.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: '<app-countdown></app-countdown>',
  imports: [CountdownComponent] // Import CountdownComponent here
})
export class AppComponent {}
