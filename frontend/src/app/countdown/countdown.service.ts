import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, of, Subscription } from 'rxjs';
import { map, switchMap, catchError, takeWhile } from 'rxjs/operators';

/**
 * CountdownService is responsible for fetching the remaining seconds until the deadline
 * from the backend API and providing countdown functionality.
 */
@Injectable({
  providedIn: 'root' // This service is available throughout the application
})
export class CountdownService implements OnDestroy {
  private apiUrl = 'http://localhost:3000/api/deadline'; // URL of the API endpoint to fetch seconds left
  private countdownSubscription: Subscription | null = null; // Store subscription for cleanup

  constructor(private http: HttpClient) {}

  /**
   * Fetches the remaining seconds until the deadline from the API.
   * @returns An Observable that emits the number of seconds left.
   */
  getSecondsLeft(): Observable<number> {
    return this.http.get<{ secondsLeft: number }>(this.apiUrl).pipe(
      map(response => response.secondsLeft), // Extract secondsLeft from the response
      catchError(error => {
        console.error('Error in getSecondsLeft:', error); // Log any errors in this method
        return of(0); // Return a default value (0) in case of an error
      })
    );
  }

  /**
   * Starts a countdown based on the remaining seconds fetched from the API.
   * @returns An Observable that emits the remaining time every second.
   */
  countdown(): Observable<number> {
    return this.getSecondsLeft().pipe(
      switchMap(seconds => {
        // Create a timer that ticks every second until seconds reach zero
        return timer(0, 1000).pipe(
          map(i => seconds - i), // Calculate remaining seconds by subtracting elapsed time (i)
          map(remaining => Math.max(remaining, 0)), // Ensure remaining time does not go below zero
          takeWhile(remaining => remaining > 0) // Complete the observable when countdown reaches zero
        );
      }),
      catchError(error => {
        console.error('Error in countdown:', error); // Log any errors in countdown
        return of(0); // Return a default value (0) in case of an error
      })
    );
  }

  /**
   * Clean up any subscriptions to avoid memory leaks.
   */
  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
}
