import Header from './header/header'
import Footer from './footer/footer'
export default  ({ children }) => (
  <div>
    <Header />
    { children }
    <Footer />
  </div>
)