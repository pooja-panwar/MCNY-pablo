import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InquiryListPage } from './inquiry-list.page';

describe('InquiryListPage', () => {
  let component: InquiryListPage;
  let fixture: ComponentFixture<InquiryListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InquiryListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InquiryListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
