import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountdownService {
  private apiUrl = 'http://localhost:3000/api/deadline';
  
  constructor(private http: HttpClient) {}

  getSecondsLeft(): Observable<number> {
    return this.http.get<{ secondsLeft: number }>(this.apiUrl).pipe(
      tap({
        next: response => {
          console.log('Full Response:', response); // Log full response
        },
        error: error => {
          console.error('Error fetching seconds left:', error); // Log any errors
        }
      }),
      map(response => response.secondsLeft),
      catchError(error => {
        console.error('Error in getSecondsLeft:', error); // Log any errors in getSecondsLeft
        return of(0); // Return a default value
      })
    );
  }

  countdown(): Observable<number> {
    return this.getSecondsLeft().pipe(
      switchMap(seconds => {
        console.log('Seconds fetched for countdown:', seconds); // Log seconds fetched
        return timer(0, 1000).pipe(
          map(i => seconds - i),
          map(remaining => remaining < 0 ? 0 : remaining)
        );
      }),
      catchError(error => {
        console.error('Error in countdown:', error); // Log any errors in countdown
        return of(0); // Return a default value
      })
    );
  }
}
