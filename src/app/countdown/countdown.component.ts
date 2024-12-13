import { Component, OnInit } from '@angular/core';
import { CountdownService } from './countdown.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule], // Import CommonModule for ngIf and other directives
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css'],
})
export class CountdownComponent implements OnInit {
  secondsLeft$: Observable<number> | undefined;
   // Time breakdown variables
   days = '00';
   hours = '00';
   minutes = '00';
   seconds = '00';
 
   // Circular progress offset
   progressOffset = 283; // Full circle circumference
 
   // Total seconds for calculating progress
   totalSeconds: number | null = null;

  constructor(private countdownService: CountdownService) {}

  ngOnInit(): void {
    this.secondsLeft$ = this.countdownService.countdown();
    this.secondsLeft$.subscribe(secondsLeft => {
      if (this.totalSeconds === null) {
        this.totalSeconds = secondsLeft; // Set total seconds on first call
      }
      this.updateCountdown(secondsLeft);
    });
  }

  updateCountdown(secondsLeft: number) {
    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(secondsLeft / (3600 * 24));
    const hours = Math.floor((secondsLeft % (3600 * 24)) / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;

    // Update component properties
    this.days = this.padZero(days);
    this.hours = this.padZero(hours);
    this.minutes = this.padZero(minutes);
    this.seconds = this.padZero(seconds);

    // Update progress offset
    if (this.totalSeconds !== null) {
      this.progressOffset = 283 - (283 * (secondsLeft / this.totalSeconds));
    }
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }
}
