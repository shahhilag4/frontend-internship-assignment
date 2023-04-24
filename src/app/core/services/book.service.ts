import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  //Setting a base URL to search and get data
  private baseUrl = 'https://openlibrary.org';

  constructor(private http: HttpClient) { }

  //Basic functionality to search books
  searchBooks(searchKey: string, pageIndex: number, pageSize: number) {
    const offset = (pageIndex - 1) * pageSize;
    const searchUrl = `${this.baseUrl}/search.json?q=${searchKey}&fields=title,author_name,first_publish_year,book_url,first_publish_year,isbn,cover_edition_key&limit=${pageSize}&offset=${offset}`;
    return this.http.get(searchUrl);
  }
  
}
