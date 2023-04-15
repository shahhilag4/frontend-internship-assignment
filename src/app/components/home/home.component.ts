import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { BookService } from '../../core/services/book.service';

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

  constructor(private bookService: BookService) {
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
      filter((value: string) => value.length > 0),
      switchMap((searchKey: string) => {
        this.loading = true; // set loading to true
        return this.bookService.searchBooks(searchKey);
      })
    ).subscribe((data: any) => {
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
    });

    this.bookSearch.valueChanges.subscribe((value: string) => {
      if (value.trim().length == 0) {
        this.clearTable();
      }
    });
  }
  

  onSearch(): void {
    const query: string = this.bookSearch.value;
    if (query.trim().length < 3) {
      this.clearTable();
      return;
    }
    this.loading = true; // set loading to true
    this.bookService.searchBooks(query)
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
      });
  }
  
  clearTable(): void {
    this.books = [];
    this.showNoResultsMessage = false;
  }
  clearSearch(): void {
    this.bookSearch.setValue('');
  }
}
