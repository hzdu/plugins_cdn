'use strict'

/**
* jQuery function for validation fields
*/
const formcraftValidation = (($) => {
  $.fn.fcValidate = function () {
    let alphabets, alphanumeric, email, numbers, url
    if (jQuery(this).attr('data-allow-spaces') && jQuery(this).attr('data-allow-spaces') === 'true') {
      alphabets = /^[A-Za-z ]+$/
      numbers = /^[0-9 ]+$/
      alphanumeric = /^[0-9A-Za-z ]+$/
      url = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/
      email = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    } else {
      alphabets = /^[A-Za-z]+$/
      numbers = /^[0-9]+$/
      alphanumeric = /^[0-9A-Za-z]+$/
      url = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/
      email = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    }
    let form_id = jQuery(this).parents('form').attr('data-id')
    let validation = window[`FC_Validation_${form_id}`]
    let value = jQuery(this).val()
    if (jQuery(this).is('[type="checkbox"]') || jQuery(this).is('[type="radio"]')) {
      const name = jQuery(this).attr('name')
      value = jQuery(`[name="${name}"]:checked`).val()
      value = typeof value === 'undefined' ? '' : value
    }
    value = value || ''
    const thisElement = jQuery(this)
    if (thisElement.attr('data-is-required') && thisElement.attr('data-is-required') === 'true' && value.trim() === '') {
      thisElement.parents('.form-element').find('.error').text(validation.is_required)
      thisElement.parents('.form-element').addClass('error-field')
      return false
    }
    if (jQuery(this).attr('data-input-mask') && jQuery(this).attr('data-input-mask') !== '' && jQuery(this).hasClass('mask-invalid') && value !== '') {
      thisElement.parents('.form-element').find('.error').text(validation.is_invalid)
      thisElement.parents('.form-element').addClass('error-field')
      return false
    }
    if (jQuery(this).attr('data-is-required') && jQuery(this).attr('data-is-required') === 'false' && value.trim() === '') {
      thisElement.parents('.form-element').find('.error').text('')
      thisElement.parents('.form-element').removeClass('error-field')
      return true
    }
    if (jQuery(this).attr('data-min-char') && jQuery(this).attr('data-min-char') > value.length) {
      thisElement.parents('.form-element').find('.error').text(validation.min_char.replace('[x]', jQuery(this).attr('data-min-char')))
      thisElement.parents('.form-element').addClass('error-field')
      return false
    }
    if (jQuery(this).attr('data-max-char') && jQuery(this).attr('data-max-char') < value.length) {
      thisElement.parents('.form-element').find('.error').text(validation.max_char.replace('[x]', jQuery(this).attr('data-max-char')))
      thisElement.parents('.form-element').addClass('error-field')
      return false
    }
    if (jQuery(this).attr('data-val-type') && jQuery(this).attr('data-val-type') === 'email' && !value.match(email)) {
      thisElement.parents('.form-element').find('.error').text(validation.allow_email)
      thisElement.parents('.form-element').addClass('error-field')
      return false
    }
    if (jQuery(this).attr('data-val-type') && jQuery(this).attr('data-val-type') === 'alphabets' && !value.match(alphabets)) {
      thisElement.parents('.form-element').find('.error').text(validation.allow_alphabets)
      thisElement.parents('.form-element').addClass('error-field')
      return false
    }
    if (jQuery(this).attr('data-val-type') && jQuery(this).attr('data-val-type') === 'numbers' && !value.match(numbers)) {
      thisElement.parents('.form-element').find('.error').text(validation.allow_numbers)
      thisElement.parents('.form-element').addClass('error-field')
      return false
    }
    if (jQuery(this).attr('data-val-type') && jQuery(this).attr('data-val-type') === 'alphanumeric' && !value.match(alphanumeric)) {
      thisElement.parents('.form-element').find('.error').text(validation.allow_alphanumeric)
      thisElement.parents('.form-element').addClass('error-field')
      return false
    }
    if (jQuery(this).attr('data-val-type') && jQuery(this).attr('data-val-type') === 'url' && !value.match(url)) {
      thisElement.parents('.form-element').find('.error').text(validation.allow_url)
      thisElement.parents('.form-element').addClass('error-field')
      return false
    }
    if (jQuery(this).attr('data-val-type') && jQuery(this).attr('data-val-type') === 'regexp') {
      const flags = jQuery(this).attr('data-regexp').replace(/.*\/([gimy]*)$/, '$1')
      const pattern = jQuery(this).attr('data-regexp').replace(new RegExp(`^/(.*?)/${flags}$`), '$1')
      const regex = new RegExp(pattern)
      if (regex.exec(value) === null) {
        thisElement.parents('.form-element').find('.error').text(validation.allow_regexp)
        thisElement.parents('.form-element').addClass('error-field')
        return false
      }
    }
    thisElement.parents('.form-element').removeClass('error-field')
    return true
  }
})(jQuery)

export default formcraftValidation

