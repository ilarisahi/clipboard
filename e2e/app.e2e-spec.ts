import { MukaanPage } from './app.po';

describe('mukaan App', () => {
  let page: MukaanPage;

  beforeEach(() => {
    page = new MukaanPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
