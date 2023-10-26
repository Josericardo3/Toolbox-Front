import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppActividadesComponent } from './app-actividades.component';

describe('AppActividadesComponent', () => {
  let component: AppActividadesComponent;
  let fixture: ComponentFixture<AppActividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppActividadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
