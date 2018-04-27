'use strict'

const Ehlxr = {}

Ehlxr.backToTop = function () {
  const $backToTop = $('#back-to-top')

  $(window).scroll(function () {
    if ($(window).scrollTop() > 100) {
      $backToTop.fadeIn(1000)
    } else {
      $backToTop.fadeOut(1000)
    }
  })

  $backToTop.click(function () {
    $('body,html').animate({ scrollTop: 0 })
  })
}

Ehlxr.mobileNavbar = function () {
  const $mobileNav = $('#mobile-navbar')
  const $mobileNavIcon = $('.mobile-navbar-icon')
  const slideout = new Slideout({
    'panel': document.getElementById('mobile-panel'),
    'menu': document.getElementById('mobile-menu'),
    'padding': 180,
    'tolerance': 70
  })
  slideout.disableTouch()

  $mobileNavIcon.click(function () {
    slideout.toggle()
  })

  slideout.on('beforeopen', function () {
    $mobileNav.addClass('fixed-open')
    $mobileNavIcon.addClass('icon-click').removeClass('icon-out')
  })

  slideout.on('beforeclose', function () {
    $mobileNav.removeClass('fixed-open')
    $mobileNavIcon.addClass('icon-out').removeClass('icon-click')
  })

  $('#mobile-panel').on('touchend', function () {
    slideout.isOpen() && $mobileNavIcon.click()
  })
}

Ehlxr._initToc = function () {
  const SPACING = 20
  const $toc = $('.post-toc')
  const $toc_height = $('.post-toc-title').height() + $('.post-toc-content').height()
  const $footer = $('.post-footer')

  if ($toc.length) {
    const minScrollTop = $toc.offset().top - SPACING - $('.post-header').height() -5
    const maxScrollTop = $footer.offset().top - $toc_height - SPACING - $('.toc-taxonomy').height()

    const tocState = {
      start: {
        'position': 'absolute',
        'top': minScrollTop
      },
      process: {
        'position': 'fixed',
        'top': SPACING
      },
      end: {
        'position': 'absolute',
        'top': maxScrollTop
      }
    }

    $(window).scroll(function () {
      const scrollTop = $(window).scrollTop()

      if (scrollTop < minScrollTop) {
        $toc.css(tocState.start)
      } else if (scrollTop > maxScrollTop) {
        $toc.css(tocState.end)
      } else {
        $toc.css(tocState.process)
      }
    })
  }

  const HEADERFIX = 30
  const $toclink = $('.toc-link')
  const $headerlink = $('.headerlink')
  const $tocLinkLis = $('.post-toc-content li')

  const headerlinkTop = $.map($headerlink, function (link) {
    return $(link).offset().top
  })

  const headerLinksOffsetForSearch = $.map(headerlinkTop, function (offset) {
    return offset - HEADERFIX
  })

  const searchActiveTocIndex = function (array, target) {
    for (let i = 0; i < array.length - 1; i++) {
      if (target > array[i] && target <= array[i + 1]) return i
    }
    if (target > array[array.length - 1]) return array.length - 1
    return -1
  }

  $(window).scroll(function () {
    const scrollTop = $(window).scrollTop()
    const activeTocIndex = searchActiveTocIndex(headerLinksOffsetForSearch, scrollTop)

    $($toclink).removeClass('active')
    $($tocLinkLis).removeClass('has-active')

    if (activeTocIndex !== -1) {
      $($toclink[activeTocIndex]).addClass('active')
      let ancestor = $toclink[activeTocIndex].parentNode
      while (ancestor.tagName !== 'NAV') {
        $(ancestor).addClass('has-active')
        ancestor = ancestor.parentNode.parentNode
      }
    }
  })
}

Ehlxr.fancybox = function () {
  if ($.fancybox) {
    $('.post-content').each(function () {
      $(this).find('img').each(function () {
        $(this).wrap(`<a class="fancybox" href="${this.src}" data-fancybox="gallery" data-caption="${this.title}"></a>`)
      })
    })

    $('.fancybox').fancybox({
      selector: '.fancybox',
      protect: true
    })
  }
}

Ehlxr.highlight = function () {
  const blocks = document.querySelectorAll('pre code')
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const rootElement = block.parentElement
    const lineCodes = block.innerHTML.split(/\n/)
    if (lineCodes[lineCodes.length - 1] === '') lineCodes.pop()
    const lineLength = lineCodes.length

    let codeLineHtml = ''
    for (let i = 0; i < lineLength; i++) {
      codeLineHtml += `<div class="line">${i + 1}</div>`
    }

    let codeHtml = ''
    for (let i = 0; i < lineLength; i++) {
      codeHtml += `<div class="line">${lineCodes[i]}</div>`
    }

    block.className += ' highlight'
    const figure = document.createElement('figure')
    figure.className = block.className
    figure.innerHTML = `<table><tbody><tr><td class="gutter"><pre>${codeLineHtml}</pre></td><td class="code"><pre>${codeHtml}</pre></td></tr></tbody></table>`

    rootElement.parentElement.replaceChild(figure, rootElement)
  }
}

Ehlxr.toc = function () {
  const tocContainer = document.getElementById('post-toc')
  if (tocContainer !== null) {
    const toc = document.getElementById('TableOfContents')
    if (toc === null) {
      // toc = true, but there are no headings
      // tocContainer.parentNode.removeChild(tocContainer)
      // document.getElementById("sidebar").style.display = "";
      tocContainer.removeChild(document.getElementsByClassName('post-toc-title')[0]);
      tocContainer.removeChild(document.getElementsByClassName('post-toc-content')[0]);
    } else {
      this._refactorToc(toc)
      this._linkToc()
      this._initToc()
    }
  }
}

Ehlxr._refactorToc = function (toc) {
  // when headings do not start with `h1`
  const oldTocList = toc.children[0]
  let newTocList = oldTocList
  let temp
  while (newTocList.children.length === 1 && (temp = newTocList.children[0].children[0]).tagName === 'UL') newTocList = temp

  if (newTocList !== oldTocList) toc.replaceChild(newTocList, oldTocList)
}

Ehlxr._linkToc = function () {
  const links = document.querySelectorAll('#TableOfContents a:first-child')
  for (let i = 0; i < links.length; i++) links[i].className += ' toc-link'

  for (let num = 1; num <= 6; num++) {
    const headers = document.querySelectorAll('.post-content>h' + num)
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]
      header.innerHTML = `<a href="#${header.id}" class="headerlink"></a>${header.innerHTML}`
    }
  }
}

Ehlxr.flowchart = function () {
  if (!window.flowchart) return

  const blocks = document.querySelectorAll('pre code.language-flowchart')
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const rootElement = block.parentElement

    const container = document.createElement('div')
    const id = `js-flowchart-diagrams-${i}`
    container.id = id
    container.className = 'align-center'
    rootElement.parentElement.replaceChild(container, rootElement)

    const diagram = flowchart.parse(block.childNodes[0].nodeValue)
    diagram.drawSVG(id, window.flowchartDiagramsOptions ? window.flowchartDiagramsOptions : {})
  }
}

Ehlxr.sequence = function () {
  if (!window.Diagram) return

  const blocks = document.querySelectorAll('pre code.language-sequence')
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const rootElement = block.parentElement

    const container = document.createElement('div')
    const id = `js-sequence-diagrams-${i}`
    container.id = id
    container.className = 'align-center'
    rootElement.parentElement.replaceChild(container, rootElement)

    const diagram = Diagram.parse(block.childNodes[0].nodeValue)
    diagram.drawSVG(id, window.sequenceDiagramsOptions ? window.sequenceDiagramsOptions : {theme: 'simple'})
  }
}

Ehlxr.search = function () {
  $('#search-query').bind('keypress', function (event) {
    if (event.keyCode == "13") {
      search();
    }
  }).on("click", function () {
    $('#search-query').css({ border: "1px solid #D5D5D5", color: "black" });
  }).on('keyup', function () {
    search();
  });

  $('#query-icon').on("click", function () {
    search();
  });
}


function search() {
  $('#search-results').empty();
  var searchQuery = $('#search-query').val();
  if (searchQuery) {
    $('#search-query').css({ border: "1px solid #D5D5D5", color: "black" });
    executeSearch(searchQuery);
  } else {
    $('#search-query').css({ border: "1px solid #ff0000", color: "#ff0000" });
    $('#search-results').append("Please enter a word or phrase above");
  }
}

var summaryInclude = 60;
var fuseOptions = {
  shouldSort: true,
  includeMatches: true,
  threshold: 0.0,
  tokenize: true,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    { name: "title", weight: 0.8 },
    { name: "contents", weight: 0.9 },
    { name: "tags", weight: 0.3 },
    { name: "categories", weight: 0.3 }
  ]
};

function executeSearch(searchQuery) {
  $.getJSON("/index.json", function (data) {
    var pages = data;
    var fuse = new Fuse(pages, fuseOptions);
    var result = fuse.search(searchQuery);
    if (result.length > 0) {
      $('#search-results').append("<ul></ul>");
      populateResults(result, searchQuery);
    } else {
      $('#search-results').append("<p>No matches found</p>");
    }
  });
}

function populateResults(result, searchQuery) {
  $.each(result, function (key, value) {
    var contents = value.item.contents;
    var snippet = "";
    var snippetHighlights = [];
    var tags = [];
    if (fuseOptions.tokenize) {
      snippetHighlights.push(searchQuery);
    } else {
      $.each(value.matches, function (matchKey, mvalue) {
        if (mvalue.key == "tags" || mvalue.key == "categories") {
          snippetHighlights.push(mvalue.value);
        } else if (mvalue.key == "contents") {
          start = mvalue.indices[0][0] - summaryInclude > 0 ? mvalue.indices[0][0] - summaryInclude : 0;
          end = mvalue.indices[0][1] + summaryInclude < contents.length ? mvalue.indices[0][1] + summaryInclude : contents.length;
          snippet += contents.substring(start, end);
          snippetHighlights.push(mvalue.value.substring(mvalue.indices[0][0], mvalue.indices[0][1] - mvalue.indices[0][0] + 1));
        }
      });
    }

    if (snippet.length < 1) {
      snippet += contents.substring(0, summaryInclude * 2);
    }
    //pull template from hugo templarte definition
    var templateDefinition = $('#search-result-template').html();
    //replace values
    var output = render(templateDefinition, { key: key, title: value.item.title, link: value.item.permalink, tags: value.item.tags, categories: value.item.categories, snippet: snippet });
    $('#search-results ul').append(output);

    $.each(snippetHighlights, function (snipkey, snipvalue) {
      $("#summary-" + key).mark(snipvalue);
    });

  });
}

function render(templateString, data) {
  var key, find, re;
  for (key in data) {
    find = '\\$\\{\\s*' + key + '\\s*\\}';
    re = new RegExp(find, 'g');
    templateString = templateString.replace(re, data[key]);
  }
  return templateString;
}

export {Ehlxr}
