import { TestBed } from '@angular/core/testing';

import { SkilllsService } from './skillls.service';

describe('SkilllsService', () => {
  let service: SkilllsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkilllsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
