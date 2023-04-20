import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrendingSubjectsComponent } from './trending-subjects.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TrendingSubjectsComponent', () => {
  let component: TrendingSubjectsComponent;
  let fixture: ComponentFixture<TrendingSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrendingSubjectsComponent],
      imports: [ RouterTestingModule,HttpClientTestingModule ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrendingSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
