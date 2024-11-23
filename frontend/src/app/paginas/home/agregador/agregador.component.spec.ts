import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregadorComponent } from './agregador.component';

describe('AgregadorComponent', () => {
  let component: AgregadorComponent;
  let fixture: ComponentFixture<AgregadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
