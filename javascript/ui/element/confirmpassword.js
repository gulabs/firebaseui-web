/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Binds handlers for the confirm password UI element.
 */

goog.provide('firebaseui.auth.ui.element.confirmPassword');

goog.require('firebaseui.auth.soy2.strings');
goog.require('firebaseui.auth.ui.element');
goog.require('goog.dom.classlist');
goog.requireType('goog.ui.Component');


goog.scope(function() {
var element = firebaseui.auth.ui.element;


/**
 * @return {Element} The confirm password input.
 * @this {goog.ui.Component}
 */
element.confirmPassword.getConfirmPasswordElement = function() {
  return this.getElementByClass('firebaseui-id-confirm-password');
};


/**
 * @return {Element} The toggle button to show or hide the password text.
 * @this {goog.ui.Component}
 */
element.confirmPassword.getConfirmPasswordToggleElement = function() {
  return this.getElementByClass('firebaseui-id-confirm-password-toggle');
};


/** @private {string} The CSS class for the "visiblility on" eye icon. */
var CLASS_TOGGLE_ON_ = 'firebaseui-input-toggle-on';


/** @private {string} The CSS class for the "visiblility off" eye icon. */
var CLASS_TOGGLE_OFF_ = 'firebaseui-input-toggle-off';


/**
 * @private {string} The CSS class for the eye icon when the input is
 *     focused.
 */
var CLASS_TOGGLE_FOCUS_ = 'firebaseui-input-toggle-focus';


/**
 * @private {string} The CSS class for the eye icon when the input is not
 *     focused.
 */
var CLASS_TOGGLE_BLUR_ = 'firebaseui-input-toggle-blur';


/**
 * Toggles the visibility of the password text.
 * @this {goog.ui.Component}
 */
element.confirmPassword.togglePasswordVisible = function() {
  this.isConfirmPasswordVisible_ = !this.isConfirmPasswordVisible_;

  var toggleElement = element.confirmPassword.getConfirmPasswordToggleElement.call(this);
  var confirmPasswordElement = element.confirmPassword.getConfirmPasswordElement.call(this);

  if (this.isConfirmPasswordVisible_) {
    confirmPasswordElement['type'] = 'text';
    goog.dom.classlist.add(toggleElement, CLASS_TOGGLE_OFF_);
    goog.dom.classlist.remove(toggleElement, CLASS_TOGGLE_ON_);
  } else {
    confirmPasswordElement['type'] = 'password';
    goog.dom.classlist.add(toggleElement, CLASS_TOGGLE_ON_);
    goog.dom.classlist.remove(toggleElement, CLASS_TOGGLE_OFF_);
  }
  confirmPasswordElement.focus();
};


/**
 * @return {Element} The error panel.
 * @this {goog.ui.Component}
 */
element.confirmPassword.getConfirmPasswordErrorElement = function() {
  return this.getElementByClass('firebaseui-id-confirm-password-error');
};


/**
 * Validates the password field and shows/clears the error message if necessary.
 * @param {Element} confirmPasswordElement The confirm password input.
 * @param {Element} errorElement The error panel.
 * @return {boolean} True if fields are valid.
 * @private
 */
element.confirmPassword.validate_ = function(newPasswordElement, confirmPasswordElement, errorElement) {
  var newPassword = element.getInputValue(newPasswordElement) || '';
  var confirmPassword = element.getInputValue(confirmPasswordElement) || '';
  console.log(firebaseui.auth.soy2.strings)
  if (!confirmPassword) {
    element.setValid(confirmPasswordElement, false);
    element.show(errorElement,
        firebaseui.auth.soy2.strings.errorMissingPassword().toString());
    return false;
  } else if (newPassword !== confirmPassword) {
    element.setValid(confirmPasswordElement, false);
    element.show(errorElement,
        firebaseui.auth.soy2.strings.errorMismatchPassword().toString());
    return false;
  } else {
    element.setValid(confirmPasswordElement, true);
    element.hide(errorElement);
    return true;
  }
};


/**
 * Initializes the confirm password element.
 * @this {goog.ui.Component}
 */
element.confirmPassword.initConfirmPasswordElement = function() {
  this.isConfirmPasswordVisible_ = false;

  var confirmPasswordElement = element.confirmPassword.getConfirmPasswordElement.call(this);
  confirmPasswordElement['type'] = 'password';

  var errorElement = element.confirmPassword.getConfirmPasswordErrorElement.call(this);

  element.listenForInputEvent(this, confirmPasswordElement, function(e) {
    // Clear but not show error on-the-fly.
    if (element.isShown(errorElement)) {
      element.setValid(confirmPasswordElement, true);
      element.hide(errorElement);
    }
  });

  var toggleElement = element.confirmPassword.getConfirmPasswordToggleElement.call(this);
  goog.dom.classlist.add(toggleElement, CLASS_TOGGLE_ON_);
  goog.dom.classlist.remove(toggleElement, CLASS_TOGGLE_OFF_);

  element.listenForFocusInEvent(this, confirmPasswordElement, function(e) {
    goog.dom.classlist.add(toggleElement, CLASS_TOGGLE_FOCUS_);
    goog.dom.classlist.remove(toggleElement, CLASS_TOGGLE_BLUR_);
  });

  element.listenForFocusOutEvent(this, confirmPasswordElement, function(e) {
    goog.dom.classlist.add(toggleElement, CLASS_TOGGLE_BLUR_);
    goog.dom.classlist.remove(toggleElement, CLASS_TOGGLE_FOCUS_);
  });

  element.listenForActionEvent(this, toggleElement,
      goog.bind(element.confirmPassword.togglePasswordVisible, this));
};


/**
 * Gets the confirm password.
 * It validates the fields and shows/clears the error message if necessary.
 * @return {?string} The confirm password.
 * @this {goog.ui.Component}
 */
element.confirmPassword.checkAndGetConfirmPassword = function() {
  var newPasswordElement = element.newPassword.getNewPasswordElement.call(this);
  var confirmPasswordElement = element.confirmPassword.getConfirmPasswordElement.call(this);
  var errorElement = element.confirmPassword.getConfirmPasswordErrorElement.call(this);
  if (element.confirmPassword.validate_(newPasswordElement, confirmPasswordElement, errorElement)) {
    return element.getInputValue(confirmPasswordElement);
  }
  return null;
};
}); // goog.scope
