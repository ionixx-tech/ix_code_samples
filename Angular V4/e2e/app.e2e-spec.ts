import { DigiverifierPage } from './app.po';

describe('Digiverifier App', () => {
  let page: DigiverifierPage;

  beforeEach(() => {
    page = new DigiverifierPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
