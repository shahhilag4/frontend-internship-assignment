import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly baseUrl = 'https://openlibrary.org';

  constructor(private http: HttpClient) {}

  searchBooks(searchKey: string, pageIndex: number, pageSize: number, limit: number = 10): Observable<any> {
    const searchUrl = `${this.baseUrl}/search.json?q=${searchKey}&fields=title,author_name,first_publish_year,book_url,first_publish_year,isbn,cover_edition_key&page=${pageIndex}&limit=${limit}`;
    return this.http.get(searchUrl).pipe(shareReplay());
  }
}
