import { Dotrack2Page } from './app.po';

describe('dotrack2 App', function() {
  let page: Dotrack2Page;

  beforeEach(() => {
    page = new Dotrack2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
