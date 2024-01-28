import { DeslugifyPipe } from './deslugify.pipe';

describe('DeslugifyPipe', () => {
  it('create an instance', () => {
    const pipe = new DeslugifyPipe();
    expect(pipe).toBeTruthy();
  });
});
