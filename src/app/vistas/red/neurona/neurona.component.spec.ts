import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuronaComponent } from './neurona.component';

describe('NeuronaComponent', () => {
  let component: NeuronaComponent;
  let fixture: ComponentFixture<NeuronaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeuronaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NeuronaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
