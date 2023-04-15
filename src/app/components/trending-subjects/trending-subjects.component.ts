import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router  } from '@angular/router';
import { SubjectsService } from '../../core/services/subjects.service';
import { Book } from 'src/app/core/models/book-response.model';

@Component({
  selector: 'front-end-internship-assignment-trending-subjects',
  templateUrl: './trending-subjects.component.html',
  styleUrls: ['./trending-subjects.component.scss'],
})
export class TrendingSubjectsComponent implements OnInit {

  loading: boolean = true;

  subjectName: string = '';

  allBooks: Book[] = [];

  constructor(
    private route: ActivatedRoute,
    private subjectsService: SubjectsService,
    private router: Router
  ) {}

  getAllBooks() {
    this.subjectsService.getAllBooks(this.subjectName).subscribe((data) => {
      this.allBooks = data?.works;
      this.loading = false;
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.subjectName = params.get('name') || '';
      this.loading = true;
      this.getAllBooks();
    });

  }
  goBack(): void {
    this.router.navigate(['/']);
  }

}
