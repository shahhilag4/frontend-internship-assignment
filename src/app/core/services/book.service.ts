import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = 'http://openlibrary.org';

  constructor(private http: HttpClient) { }

  searchBooks(searchKey: string, pageIndex: number, pageSize: number) {
    const searchUrl = `${this.baseUrl}/search.json?q=${searchKey}&fields=title,author_name,first_publish_year,book_url,first_publish_year,isbn,cover_edition_key&page=${pageIndex}&limit=${pageSize}`;
    return this.http.get(searchUrl);
  }


  getBooks(page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const searchUrl = `${this.baseUrl}/search.json?q=javascript&fields=title,author_name,first_publish_year,book_url,first_publish_year,isbn,cover_edition_key&offset=${offset}&limit=${limit}`;
    return this.http.get(searchUrl);
  }
}
