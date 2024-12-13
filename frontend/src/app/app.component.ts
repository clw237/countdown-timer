import { Component } from '@angular/core';
import { CountdownComponent } from './countdown/countdown.component';
/**
 * AppComponent serves as the root component of the Angular application.
 * It acts as a container for other components and manages the overall layout.
 */
@Component({
  selector: 'app-root', // The HTML tag that represents this component
  standalone: true,
  template: '<app-countdown></app-countdown>', // Template that includes the CountdownComponent
  imports: [CountdownComponent] // Import CountdownComponent here to use it in the template
})
export class AppComponent {}
