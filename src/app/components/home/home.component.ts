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
  // Variable declaration
  bookSearch: FormControl;
  books: Array<any> = [];
  showNoResultsMessage = false;
  loading = false;
  pageIndex = 1;
  totalResults = 0;

  //Pagination variables
  currentPage=1;
  pageSize =10;
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

  //Load functionalities on starting of the application
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
      
      //Caching
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
      //Fetching data from API
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
          this.onSearch(); // call search functionality to get accurate page count
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
  //reset paginator data on new query detection
  resetPaginator(): void {
    if (this.paginator) {
      this.paginator.firstPage();
      this.paginator.length = this.books.length;
    }
  }
  //Search functionality
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
  //Count the number of pages based on a formula
  pageCount(): number {
    const count = Math.ceil(this.totalResults / this.pageSize); // calculate number of pages
    return count;
  }
  
  //On clicking next or previous this function will be called
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
  
  
  //clear all books when the query is cleared  
  clearTable(): void {
    this.books = [];
    this.showNoResultsMessage = false;
  }
  //clear searches on clicking button
  clearSearch(): void {
    this.bookSearch.setValue('');
  } 
}
