import Router from './modules/Routing/Router';
import SignIn from './views/Registration/SignIn/SignIn';
import SignUp from './views/Registration/SignUp/SignUp';
import Main from './views/Main/Main';

import './static/css/reset.scss';

const router = new Router();

const eventListener = (event => {
  const element = event.target;
  if ((element.tagName === 'a' || (element.getAttribute('data-nav')))) {
    const url = element.getAttribute('data-nav') || element.getAttribute('href');
    if (element.target !== '_blank' && element.target !== '_self') {
      event.preventDefault();
      new Router().go(url);
    }
  }
});

window.addEventListener('click', eventListener);

router
  .use('/', Main)
  .use('/profile', Profile)
  .use('/test', Test)
  .use('/signup', SignUp)
  .use('/signin', SignIn)
  .start();
