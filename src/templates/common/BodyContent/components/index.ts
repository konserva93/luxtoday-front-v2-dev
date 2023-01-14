import marks from './marks'
import gallery from './gallery'
import highlight from './highlight'
import quote from './quote'
import image from './image'
import heading from './heading'

const naked = ({ children } : any) => children

export const types = {
  interviewBlueHighlight: highlight,
  interviewYellow: highlight,
  guideArticleImportant: highlight,
  interviewYellowLamp: highlight,
  gallery,
  interviewWhiteQuote: quote,
  interviewBlueQuote: quote,
  guideArticleBlueQuote: quote,
  guideArticleQuoteWithLink: quote,
  interviewInlineImage: image,
  image: image,
  figure: naked,
}

const block = {
  h1: heading,
  h2: heading,
  h3: heading,
  h4: heading,
  h5: heading,
  h6: heading,
}

const components = { types, marks, block }

export default components
