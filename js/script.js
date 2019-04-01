function ask(isbn) {
  if(isbn == '') {
    alert("정보가 없는 책입니다.");
    return;
  } else {
    location.href = "ask.html?isbn=" + isbn;
  }
}

var title = '';
getThisTitle();

window.addEventListener("hashchange", function () {
  getThisTitle();
}, false);

function getThisTitle() {
  if (location.href.split('#').length == 2) {
    title = decodeURI(location.href.split('#')[1]);
    $('#title').val(title);
    getinformation(title);
  }
}

function getStar() {
  var stars = $('.star-prototype');
  var starList = '';
  for (var i = 0; i < stars.length; i++) {
    var star = Math.floor(stars[i].dataset.star * 0.5);
    for (var j = 0; j < star; j++) {
      starList += "<img src='./img/search/star.png' width='17.5px'/>"
    }
    for (var j = 0; j < 5 - star; j++) {
      starList += "<img src='./img/search/bin-star.png' width='17.5px'/>"
    }
    stars[i].innerHTML = starList;
    starList = '';
  }
}

$('#title').on('change', function () {
  var thisTitle = $(this).val();
  if (title != thisTitle) {
    location.href = 'search.html#' + encodeURI(thisTitle);
  }
  getinformation(title);
});

function getinformation(title) {
  var search = title ? title : "";
  var ttbkey = 'ttbysasm21451849002';
  var url = 'http://www.aladin.co.kr/ttb/api/ItemSearch.aspx';
  url += '?' + encodeURIComponent('ttbkey') + '=' + ttbkey;
  url += '&' + encodeURIComponent('QueryType') + '=' + encodeURIComponent('Title');
  url += '&' + encodeURIComponent('Version') + '=' + encodeURIComponent('20131101');
  url += '&' + encodeURIComponent('Query') + '=' + encodeURIComponent(search);

  $.get(url, function (res) {
    $('.list li').remove();
    $('.result').text('');
    var items = $(res).find('item');
    var result = '"<b>' + search + '</b>" 검색결과 입니다.';
    for (var i = 0; i < items.length; i++) {
      var title = $(items[i]).find('title').text();
      var author = $(items[i]).find('author').text();
      var cover = $(items[i]).find('cover').text();
      var customerReviewRank = $(items[i]).find('customerReviewRank').text();
      var isbn13 = $(items[i]).find('isbn13').text();
      var code = '<li class="list-item" onclick="ask(' + isbn13 + ');">' +
        '<img src="' + cover + '">' +
        '<div class="content">' +
        '<p>' + title + '</p>' +
        '<p class="author">' + author + '</p>' +
        '<span class="star-prototype" data-star="' + customerReviewRank + '"></span>' +
        '</div>' +
        '</li>';
      $('.list').append(code);
      if (i == items.length - 1) {
        $('.result').append(result);
      }
      getStar();
    }
  });
}