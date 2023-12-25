import { TestBed } from '@angular/core/testing';

import { CreateCvService } from './create-cv.service';

describe('CreateCvService', () => {
  let service: CreateCvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateCvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
