import { BrockmanNpmPage } from './app.po';

describe('brockman-npm App', () => {
  let page: BrockmanNpmPage;

  beforeEach(() => {
    page = new BrockmanNpmPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
