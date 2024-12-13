import { Component, OnInit } from '@angular/core';
import { CountdownService } from './countdown.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule], // Import CommonModule for Angular directives like ngIf
  templateUrl: './countdown.component.html', 
  styleUrls: ['./countdown.component.css'], 
})
export class CountdownComponent implements OnInit {
  secondsLeft$: Observable<number> | undefined; // Observable for seconds left until the deadline

  // Time breakdown variables initialized to zero-padded strings
  days = '00';
  hours = '00';
  minutes = '00';
  seconds = '00';

  // Total seconds for calculating progress
  totalSeconds: number | null = null; // Holds the total seconds at the start of the countdown

  constructor(private countdownService: CountdownService) {}

  ngOnInit(): void {
    // Start the countdown by subscribing to the countdown observable from the service
    this.secondsLeft$ = this.countdownService.countdown();
    this.secondsLeft$.subscribe(secondsLeft => {
      if (this.totalSeconds === null) {
        this.totalSeconds = secondsLeft; // Set total seconds on first call for further calculations
      }
      this.updateCountdown(secondsLeft); // Update time breakdown
    });
  }

  /**
   * Updates the countdown display based on the remaining seconds.
   * @param secondsLeft - The number of seconds remaining until the deadline.
   */
  updateCountdown(secondsLeft: number) {
    // Calculate days, hours, minutes, and seconds from total seconds left
    const days = Math.floor(secondsLeft / (3600 * 24)); // Calculate full days
    const hours = Math.floor((secondsLeft % (3600 * 24)) / 3600); // Remaining hours in current day
    const minutes = Math.floor((secondsLeft % 3600) / 60); // Remaining minutes in current hour
    const seconds = secondsLeft % 60; // Remaining seconds in current minute

    // Update component properties with zero-padded values for display
    this.days = this.padZero(days);
    this.hours = this.padZero(hours);
    this.minutes = this.padZero(minutes);
    this.seconds = this.padZero(seconds);
  }

  /**
   * Pads a number with a leading zero if it is less than ten.
   * @param num - The number to pad.
   * @returns A string representation of the padded number.
   */
  padZero(num: number): string {
    return num < 10 ? `0${num}` : num.toString(); // Return padded or original number as a string
  }
}
