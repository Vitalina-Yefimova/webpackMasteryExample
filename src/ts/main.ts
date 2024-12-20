import '../styles/style.scss'
import '../styles/style.less'
import { greeting } from '../js/script'
import image from '../assets/images/word-hey.jpg'
import '../assets/fonts/Roboto-Regular.woff'


const imgElement: HTMLImageElement = document.createElement('img')
imgElement.src = image
imgElement.alt = 'Image with word Hey'
imgElement.style.marginTop = '15px'
document.body.appendChild(imgElement)

const button: HTMLButtonElement | null = document.querySelector('button')
if (button) {
  button.addEventListener('click', greeting)
}
else {
  console.error('Button is not found in the DOM.')
}