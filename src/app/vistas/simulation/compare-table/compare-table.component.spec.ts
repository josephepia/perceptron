import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareTableComponent } from './compare-table.component';

describe('CompareTableComponent', () => {
  let component: CompareTableComponent;
  let fixture: ComponentFixture<CompareTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompareTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
