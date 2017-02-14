import { PublicV2Page } from './app.po';

describe('public-v2 App', function() {
  let page: PublicV2Page;

  beforeEach(() => {
    page = new PublicV2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
