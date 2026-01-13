import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChevronLeftIcon, ChevronRightIcon, LucideAngularModule } from 'lucide-angular';
import { Pagination } from './pagination';

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination, LucideAngularModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 5);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the correct number of page buttons', () => {
    const pageBtns = fixture.debugElement.queryAll(By.css('[data-tm="page-btn"]'));
    const pageActiveBtn = fixture.debugElement.queryAll(By.css('[data-tm="page-active-btn"]'));

    const pageButtons = pageBtns.filter(btn => !isNaN(Number(btn.nativeElement.textContent?.trim())));
    const pageActiveButton = pageActiveBtn.filter(btn => !isNaN(Number(btn.nativeElement.textContent?.trim())));
    expect((pageButtons.length) + (pageActiveButton.length)).toBe(5);
  });

  it('should highlight the active page button', () => {
    fixture.componentRef.setInput('currentPage', 3);
    fixture.detectChanges();

    const activeBtn = fixture.debugElement.query(By.css('[data-tm="page-active-btn"]'));
    expect(activeBtn.nativeElement.textContent.trim()).toBe('3');
  });

  it('should emit pageChange event when a valid page is clicked', () => {
    const emitSpy = jest.spyOn(component.pageChange, 'emit');

    component.changePage(4);

    expect(emitSpy).toHaveBeenCalledWith(4);
  });

  it('should disable the "Previous" button on the first page', () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();

    const prevBtn = fixture.debugElement.query(By.css('[data-tm="prev-btn"]'));
    expect(prevBtn.nativeElement.disabled).toBe(true);
  });

  it('should disable the "Next" button on the last page', () => {
    fixture.componentRef.setInput('currentPage', 5);
    fixture.detectChanges();

    const nextBtn = fixture.debugElement.query(By.css('[data-tm="next-btn"]'));
    expect(nextBtn.nativeElement.disabled).toBe(true);
  });

  it('should not emit pageChange for out-of-bounds pages', () => {
    const emitSpy = jest.spyOn(component.pageChange, 'emit');

    component.changePage(0);
    component.changePage(6);

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
