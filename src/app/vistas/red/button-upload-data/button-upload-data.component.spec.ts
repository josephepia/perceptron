import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonUploadDataComponent } from './button-upload-data.component';

describe('ButtonUploadDataComponent', () => {
  let component: ButtonUploadDataComponent;
  let fixture: ComponentFixture<ButtonUploadDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonUploadDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonUploadDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
