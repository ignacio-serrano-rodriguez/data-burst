import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCreadoComponent } from './usuario-creado.component';

describe('UsuarioCreadoComponent', () => {
  let component: UsuarioCreadoComponent;
  let fixture: ComponentFixture<UsuarioCreadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioCreadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsuarioCreadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
