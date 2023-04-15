import { Component, OnInit,ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { BookService } from '../../core/services/book.service';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  bookSearch: FormControl;
  books: Array<any> = [];
  showNoResultsMessage: boolean = false;
  loading: boolean = false;
  pageIndex: number = 1;
  totalResults: number = 0;
  
  currentPage:number=1;
  pageSize: number =10;
  cachedBooks: { [key: string]: Array<any> } = {};
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private bookService: BookService,private http: HttpClient) {
    this.bookSearch = new FormControl('');
  }

  trendingSubjects: Array<any> = [
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Harry Potter' },
    { name: 'Crypto' },
  ];

  ngOnInit(): void {
    this.bookSearch.valueChanges.pipe(
      debounceTime(300),
      filter((value: string) => value.length > 0)
    ).subscribe((searchKey: string) => {
      if (this.loading) {
        return; // don't trigger search if already loading
      }
      if (searchKey.trim().length < 3) {
        this.clearTable();
        return;
      }
      this.loading = true; // set loading to true
      const cacheKey = searchKey.trim().toLowerCase(); // normalize cache key
      if (this.cachedBooks[cacheKey]) { // check if data is already cached
        this.loading = false; // set loading to false
        this.books = this.cachedBooks[cacheKey]; // get data from cache
        this.resetPaginator(); // reset the paginator to the first page after the search results are loaded
        // show "No results found" if search results are empty
        if (this.books.length === 0) {
          this.showNoResultsMessage = true;
        } else {
          this.showNoResultsMessage = false;
        }
        return;
      }
      this.bookService.searchBooks(searchKey, this.currentPage, this.pageSize)
        .subscribe((data: any) => {
          this.loading = false; // set loading to false
          this.books = data.docs.map((book: any) => {
            return {
              title: book.title,
              authorName: book.author_name ? book.author_name.join(', ') : '',
              year: book.first_publish_year || '',
              isbn: book.isbn ? book.isbn[0] : '',
              bookUrl: `https://openlibrary.org/books/${book.cover_edition_key ? book.cover_edition_key : book.key}`
            };
          });
          this.onSearch(); // call pageCount to update paginator length
          // show "No results found" if search results are empty
          if (this.books.length === 0) {
            this.showNoResultsMessage = true;
          } else {
            this.showNoResultsMessage = false;
          }
          if((<HTMLInputElement>document.getElementById("search")).value.length==0)
          {
            this.clearTable();
          }
  
          // reset the paginator to the first page after the search results are loaded
          if (this.paginator) {
            this.paginator.firstPage();
            this.paginator.length = this.books.length;
          }
          this.cachedBooks[cacheKey] = this.books; // add data to cache
        });
    });
  
    this.bookSearch.valueChanges.subscribe((value: string) => {
      if (value.trim().length == 0) {
        this.clearTable();
      }
    });
    
  }
  
  resetPaginator(): void {
    if (this.paginator) {
      this.paginator.firstPage();
      this.paginator.length = this.books.length;
    }
  }
  onSearch(): void {
    const query: string = this.bookSearch.value;
    if (query.trim().length < 3) {
      this.clearTable();
      return;
    }
    this.loading = true; // set loading to true
    this.bookService.searchBooks(query, this.pageIndex, this.pageSize)
      .subscribe((response: any) => {
        this.loading = false; // set loading to false
        this.books = response.docs.map((book: any) => {
          return {
            title: book.title,
            authorName: book.author_name ? book.author_name.join(', ') : '',
            year: book.first_publish_year || '',
            isbn: book.isbn ? book.isbn[0] : '',
            bookUrl: `https://openlibrary.org/books/${book.cover_edition_key ? book.cover_edition_key : book.key}`
          };
        });
        // show "No results found" if search results are empty
        if (this.books.length === 0) {
          this.showNoResultsMessage = true;
        } else {
          this.showNoResultsMessage = false;
        }
        this.totalResults = response.numFound; // update totalResults property
        console.log(this.totalResults);
        this.pageCount(); // call pageCount to update paginator length
        this.paginator.firstPage(); // reset paginator to first page
      });
  }
  
  pageCount(): number {
    const count = Math.ceil(this.totalResults / this.pageSize); // calculate number of pages
    return count;
  }
  
  
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1; // update pageIndex property
    this.pageSize = event.pageSize; // update pageSize property
    const query: string = this.bookSearch.value;
    this.bookService.searchBooks(query, this.pageIndex, this.pageSize)
      .subscribe((response: any) => {
        this.loading = false;
        this.books = response.docs.map((book: any) => {
          return {
            title: book.title,
            authorName: book.author_name ? book.author_name.join(', ') : '',
            year: book.first_publish_year || '',
            isbn: book.isbn ? book.isbn[0] : '',
            bookUrl: `https://openlibrary.org/books/${book.cover_edition_key ? book.cover_edition_key : book.key}`
          };
        });
        this.totalResults = response.numFound; // update totalResults property
        if (this.books.length === 0) {
          this.showNoResultsMessage = true;
        } else {
          this.showNoResultsMessage = false;
        }
      });
  }
  
  
  
  clearTable(): void {
    this.books = [];
    this.showNoResultsMessage = false;
  }
  clearSearch(): void {
    this.bookSearch.setValue('');
  }

  // getPageCount(): number {
  //   console.log(Math.ceil(this.totalResults / this.pageSize))
  //   return Math.ceil(this.totalResults / this.pageSize);
  // }
    
}
