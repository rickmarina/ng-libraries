import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgToastNotifyComponent } from './ng-toast-notify.component';

describe('NgToastNotifyComponent', () => {
  let component: NgToastNotifyComponent;
  let fixture: ComponentFixture<NgToastNotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgToastNotifyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgToastNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
