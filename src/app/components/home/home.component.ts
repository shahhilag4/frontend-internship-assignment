import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BookService } from '../../core/services/book.service';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // Variable declaration
  bookSearch: FormControl;
  books: Array<{
    title: string,
    authorName: string,
    year: string,
    isbn: string,
    bookUrl: string
  }> = [];
  showNoResultsMessage = false;
  loading = false;

  //Pagination variables
  pageIndex = 1;
  totalResults = 0;
  currentPage = 1;
  pageSize = 10;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Caching variables
  cachedBooks: { [key: string]: Array<any> } = {};
  cachedTotalResults: { [query: string]: number } = {};

  //Constructor to get add an initial state
  constructor(private bookService: BookService) {
    this.bookSearch = new FormControl('');
  }


  
  //Trending subjects
  trendingSubjects: Array<any> = [
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Harry Potter' },
    { name: 'Crypto' },
  ];

  //Load functionalities on starting of the application -----> Debouncing functionality leveraged
  ngOnInit() {
    this.bookSearch.valueChanges
      .pipe(
        debounceTime(300) // wait for 300ms before emitting the next value
      )
      .subscribe(() => {
        this.onSearch();
      });

    // Clear local storage every 1 day
    setInterval(() => {
      localStorage.clear();
    }, 1 * 24 * 60 * 60 * 1000); // 1 day in milliseconds
  }

  //Reset paginator data on new query detection
  resetPaginator(): void {
    if (this.paginator) {
      this.paginator.firstPage();
      this.paginator.length = this.books.length;
    }
  }

  //Search functionality
  async onSearch(): Promise<void> {
    const query: string = this.bookSearch.value;
    //if value of query less than 2 or strictly equal to 0 then clear search table
    if (query.trim().length < 2 || query.trim().length === 0) {
      this.clearTable();
      return;
    }
    this.loading = true; // else set loading to true

    // Check if result is already cached in localStorage
    const cachedData = localStorage.getItem(query);
    if (cachedData) {
      const { books, totalResults } = JSON.parse(cachedData);
      this.loading = false; // set loading to false
      this.books = books;
      this.totalResults = totalResults; // update totalResults property
      this.showNoResultsMessage = this.books.length === 0; // show "No results found" if search results are empty
      this.pageCount(); // call pageCount to update paginator length
      this.paginator.firstPage(); // reset paginator to first page
      return;
    }

    try {
      const response = await firstValueFrom(this.bookService.searchBooks(query, this.pageIndex, this.pageSize)); // change the pageIndex and pageSize to 1 and 10 respectively
      this.loading = false; // set loading to false
      this.books = response.docs.map((book: any) => {
        return {
          title: book.title,
          authorName: book.author_name ? book.author_name.join(', ') : '',
          year: book.first_publish_year || '',
          isbn: book.isbn ? book.isbn[0] : '',
          bookUrl: `https://openlibrary.org/books/${book.cover_edition_key ? book.cover_edition_key : book.key
            }`,
        };
      });

      // show "No results found" if search results are empty
      this.showNoResultsMessage = this.books.length === 0;

      // update cache in localStorage
      localStorage.setItem(
        query,
        JSON.stringify({
          books: this.books,
          totalResults: response.numFound,
        })
      );

      this.totalResults = response.numFound; // update totalResults property
      console.log(this.totalResults);
      this.pageCount(); // call pageCount to update paginator length
      this.paginator.firstPage(); // reset paginator to first page
    } catch (error) {
      console.error(error);
    }
  }
  
  //On clicking next or previous this function will be called
  async onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1; // update pageIndex property
    this.pageSize = event.pageSize; // update pageSize property
    const query: string = this.bookSearch.value;
    try {
      const response = await firstValueFrom(this.bookService.searchBooks(query, this.pageIndex, this.pageSize)); // change the pageIndex and pageSize to 1 and 10 respectively
      this.loading = false;
      this.books = response.docs.map((book: any) => {
        return {
          title: book.title,
          authorName: book.author_name ? book.author_name.join(', ') : '',
          year: book.first_publish_year || '',
          isbn: book.isbn ? book.isbn[0] : '',
          bookUrl: `https://openlibrary.org/books/${book.cover_edition_key ? book.cover_edition_key : book.key
            }`,
        };
      });
      this.totalResults = response.numFound; // update totalResults property
      if (this.books.length === 0) {
        this.showNoResultsMessage = true;
      } else {
        this.showNoResultsMessage = false;
      }
    } catch (error) {
      console.error(error);
    }
  }

  //Count the number of pages based on a formula
  pageCount = (): number => Math.ceil(this.totalResults / this.pageSize);

  //clear all books when the query is cleared
  clearTable(): void {
    this.books = [];
    this.showNoResultsMessage = false;
  }

  //clear searches on clicking button
  clearSearch(): void {
    if (this.bookSearch.value !== '') {
      this.bookSearch.setValue('');
    }
  }
}
