import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TusListasComponent } from './tus-listas.component';

describe('TusListasComponent', () => {
  let component: TusListasComponent;
  let fixture: ComponentFixture<TusListasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TusListasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TusListasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
