import Header from "./header";

const Layouts = ({ children }) => (
  <div>
    <Header />
    {children}
  </div>
);

export default Layouts;
