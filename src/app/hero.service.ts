import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, map, tap } from 'rxjs/operators'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  
  private heroesUrl = 'api/heroes';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
    ) { }

  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroeService: Fetched heroes!');
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('Fetched heroes!')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
    .pipe(
      tap(_ => this.log(`Fetched hero ID: ${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions)
    .pipe(
      tap(_ => this.log(`Updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );

  }

  private log(message: string){
    this.messageService.add(`HeroeService: ${message}`);
  }

  private handleError<T>(operation = 'operation' , result?: T) {
    
    return (error: any): Observable<T> => {
      
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
      
    }
  }
}
