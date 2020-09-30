import { TestBed } from '@angular/core/testing';

import { LocalUserGuard } from './local-user.guard';

describe('LocalUserGuard', () => {
  let guard: LocalUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LocalUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
