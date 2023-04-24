import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  //Setting a base URL to search and get data
  private baseUrl = 'https://openlibrary.org';

  constructor(private http: HttpClient) {}

  //Modified functionality to search books using RxJS caching
  searchBooks(searchKey: string, pageIndex: number, pageSize: number): Observable<any> {
    const searchUrl = `${this.baseUrl}/search.json?q=${searchKey}&fields=title,author_name,first_publish_year,book_url,first_publish_year,isbn,cover_edition_key&page=${pageIndex}&limit=10`;
    return this.http.get(searchUrl).pipe(shareReplay());
  }

  //Modified functionality to get books using RxJS caching
  getBooks(page: number, pageSize: number): Observable<any> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const searchUrl = `${this.baseUrl}/search.json?q=javascript&fields=title,author_name,first_publish_year,book_url,first_publish_year,isbn,cover_edition_key&offset=${offset}&limit=10`;
    return this.http.get(searchUrl).pipe(shareReplay());
  }
}
