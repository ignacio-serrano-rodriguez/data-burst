import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TusAmigosComponent } from './tus-amigos.component';

describe('TusAmigosComponent', () => {
  let component: TusAmigosComponent;
  let fixture: ComponentFixture<TusAmigosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TusAmigosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TusAmigosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
