import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultasBasicasComponent } from './consultas-basicas.component';

describe('ConsultasBasicasComponent', () => {
  let component: ConsultasBasicasComponent;
  let fixture: ComponentFixture<ConsultasBasicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultasBasicasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultasBasicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
