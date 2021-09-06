import $ from 'jquery'
// userOption toggle
$('.logged .user_info').on('click', function (e) {
  $('.user_option').fadeToggle(200)
  e.stopPropagation()
})
$(document).on('click', function () {
  $('.user_option').fadeOut(200)
})

// errorTips
// 传数组或字符串均可
function errorTip (text, el, fadeTime) {
  // 判断字符串还是数组
  if (typeof (el) === 'string') {
    var errorDom = `<div class='errortip'>${text}</div>`
    var tipEle = $(el)
    // 判断是否存在错误提示
    if (tipEle.find('.errortip').length !== 0) {
      return
    }
    tipEle.append(errorDom)
    // 定时移除错误提示
    setTimeout(() => {
      $('.errortip').remove()
    }, fadeTime)
  } else {
    el.map(function (_class, index) {
      var errorDom = `<div class='errortip'>${text[index]}</div>`
      var tipEle = $(_class)
      // 判断是否存在错误提示
      if (tipEle.find('.errortip').length !== 0) {
        return
      }
      tipEle.append(errorDom)
      // 定时移除错误提示
      setTimeout(() => {
        $('.errortip').remove()
      }, fadeTime)
    })
  }
}
$('.login').on('click', function () {
  errorTip(['asdasd', '撒大苏打撒'], ['.form_item.account', '.form_item.pwd'], 5000)
})

// loginBox toggle
$('.user_box.notlogin').on('click', () => {
  $('.login_box').fadeIn(200)
  $('.login_box .close').on('click', () => {
    $('.login_box').fadeOut(200)
  })
  // $('.login').on('click',function(){
  //   $(".login_box").fadeOut(200);
  //   $(".user_box.notlogin").hide()
  //   $(".user_box.logged").show()
  // })
})
