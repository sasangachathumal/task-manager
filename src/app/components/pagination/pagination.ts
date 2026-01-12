import { Component, computed, input, output } from '@angular/core';
import { ChevronLeftIcon, ChevronRightIcon, LucideAngularModule, SearchIcon } from 'lucide-angular';

@Component({
  selector: 'app-pagination',
  imports: [LucideAngularModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {

  currentPage = input.required<number>();
  totalPages = input.required<number>();

  readonly ChevronLeftIcon = ChevronLeftIcon;
  readonly ChevronRightIcon = ChevronRightIcon;

  pageChange = output<number>();

  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

}
