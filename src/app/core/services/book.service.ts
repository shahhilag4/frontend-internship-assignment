import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = 'http://openlibrary.org';

  constructor(private http: HttpClient) { }

  searchBooks(searchKey: string) {
    const searchUrl = `${this.baseUrl}/search.json?q=${searchKey}&fields=title,author_name,first_publish_year,book_url,first_publish_year,isbn,cover_edition_key`;
    return this.http.get(searchUrl);
  }
  

}
