import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrendingSubjectsComponent } from './trending-subjects.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TrendingSubjectsComponent', () => {
  let component: TrendingSubjectsComponent;
  let fixture: ComponentFixture<TrendingSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrendingSubjectsComponent],
      imports: [ RouterTestingModule,HttpClientTestingModule ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA // add the schema to suppress the error
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TrendingSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
