import {Ehlxr} from './ehlxr.js'

import '../css/style.scss'

$(document).ready(function () {
  Ehlxr.backToTop()
  Ehlxr.mobileNavbar()
  Ehlxr.toc()
  Ehlxr.fancybox()
  Ehlxr.search()
})

Ehlxr.flowchart()
Ehlxr.sequence()

hljs.initHighlighting()
Ehlxr.highlight()
