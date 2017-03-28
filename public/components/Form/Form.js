import Block from '../Block/Block';
import Button from '../Button/Button';
import userService from '../../services/UserService/UserService';
import formService from '../../services/FormService/FormService';
import viewService from '../../services/ViewService/ViewService';

import './Form.scss';
import template from './Form.tmpl.xml';

export default class Form extends Block {
  constructor(elements = {}) {
    super('div', {
      class: 'form__wrapper'
    });

    this._createForm(elements.data);
  }

  _createForm(elements) {
    const titleForm = elements.title;

    this._getElement().innerHTML = template({
      title: titleForm,
      elements: elements.fields
    });

    this.find('form').appendChild((this._submitButton(elements.controls[0]).render()));
    this.find('form').appendChild((this._backButton(elements.controls[1]).render()));
    this._inputsFocusEvent();
  }

  _inputsFocusEvent() {
    const form = this.find('form').querySelector('ul').children;

    this._getKeys(form).forEach(input => {
      this._setFocus(form[input]);
    });
  }

  _getInput(element) {
    return element.querySelector('input');
  }

  _setFocus(element) {
    const input = this._getInput(element);

    input.onblur = (() => {
      const name = input.name;
      const value = input.value;
      const fill = formService.checkFill(value, this._getReadableNameByName(name)).response;

      if (fill) {
        this._addError(element, fill);
      } else {
        const check = this._checkByName(name, value).response;

        if (check) {
          this._addError(element, check);
          return;
        }

        if (name === 'password1') {
          const secondPassword = this._getNextPassword(element);

          if (secondPassword && secondPassword.classList.contains('error') &&
            formService.checkPasswords(input, secondPassword).response) {
            this._defaultError(secondPassword);
            this._addOK(secondPassword);
          }
        }

        if (input.name === 'password2') {
          const firstPassword = this._getPreviousPassword(element).value;
          const compare = formService.checkPasswords(value, firstPassword).response;

          if (compare) {
            this._addError(element, compare);
            return;
          }
        }

        this._addOK(element);
        this._letGoSubmit(this._getFormByList(element), element.parentNode.querySelectorAll('li'));
      }
    });

    input.onfocus = (() => {
      this._defaultError(element);
    });
  }

  _getFormByList(element) {
    return element.parentNode.parentNode;
  }

  _addOK(element) {
    const span = element.querySelector('span');

    element.classList.remove('error');
    element.classList.add('ok');

    span.innerText = 'Excellent!';
  }

  _addError(element, errorText) {
    const span = element.querySelector('span');

    element.classList.add('error');
    span.classList.add('errorText');
    span.innerText = errorText;
  }

  _defaultError(element) {
    const span = element.querySelector('span');

    element.classList.remove('error');
    element.classList.remove('ok');

    span.classList.remove('errorText');
  }

  _checkByName(type, value) {
    switch (type) {
      case 'login':
        return formService.checkLogin(value);
      case 'email':
        return formService.checkEmail(value);
      case 'password1':
      case 'password2':
        return formService.checkPassword(value);
      default:
        return '';
    }
  }

  _getReadableNameByName(type) {
    switch (type) {
      case 'login':
        return 'Login';
      case 'email':
        return 'E-Mail';
      case 'password1':
      case 'password2':
        return 'Password';
      default:
        return '';

    }
  }

  _letGoSubmit(element, list) {
    for (let li of list) {
      if (!li.classList.contains('ok')) {
        return null;
      }
    }

    const submit = element.querySelector('button');

    submit.disabled = false;
  }

  _submitButton(button) {
    const submit = new Button({
      type: 'submit',
      text: button.text
    });

    submit.setAttributeBlock('disabled', 'disabled');
    submit.start('click', event => this._submit(event, button.action));

    return submit;
  }

  _backButton(button) {
    const back = new Button({
      type: 'submit',
      text: button.text
    });

    back.start('click', event => {
      event.preventDefault();
      viewService.go('/');
    });

    return back;
  }

  _submit(event, uri) {
    event.preventDefault();

    const data = this._getData();

    formService.sendRequest(uri, this._getSendPack(uri, data))
      .then(response => {
        console.log(response);
        return +response.status === 200;
      })
      .then(status => {
        userService.setState(status);
        if (status) {
          viewService.go('/');
        }
      });
  }

  _getSendPack(uri, data) {
    return uri === '/signin' ? this._signInPack(data) : this._signUpPack(data);
  }

  _signInPack(data) {
    return {
      'username': data.login,
      'password': data.password1
    };
  }

  _signUpPack(data) {
    return {
      'login': data.login,
      'email': data.email,
      'password': data.password1
    };
  }

  _getData() {
    const form = this.find('form').elements;
    const fields = {};

    this._getKeys(form).forEach(input => {
      const name = form[input].name;

      if (name) {
        fields[name] = form[input].value;
      }
    });
    return fields;
  }

  _getPreviousElement(input) {
    return input.previousElementSibling;
  }

  _getNextElement(input) {
    return input.nextElementSibling;
  }

  _getPreviousPassword(passwordInput) {
    const password = passwordInput.parentNode.children[2];
    return password ? password.querySelector('input') : null;
  }

  _getNextPassword(passwordInput) {
    const password = passwordInput.parentNode.children[3];
    return password ? password.querySelector('input') : null;
  }
}
