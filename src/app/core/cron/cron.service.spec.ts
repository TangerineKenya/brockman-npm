import { TestBed, inject } from '@angular/core/testing';

import { CronService } from './cron.service';

describe('CronService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CronService]
    });
  });

  it('should ...', inject([CronService], (service: CronService) => {
    expect(service).toBeTruthy();
  }));
});
