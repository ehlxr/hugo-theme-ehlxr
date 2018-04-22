import {Even} from './ehlxr.js'

import '../css/style.scss'

$(document).ready(function () {
  Even.backToTop()
  Even.mobileNavbar()
  Even.toc()
  Even.fancybox()
})

Even.flowchart()
Even.sequence()

hljs.initHighlighting()
Even.highlight()
