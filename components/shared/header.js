import Head from "next/head";
const Header = () => (
  <div>
    <Head>
      <script async defer src="https://apis.google.com/js/api.js" />
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossOrigin="anonymous"
      />
    </Head>
    <style jsx global>{`
      html {
        scroll-behavior: smooth;
      }
      body {
        overflow-y: scroll;
      }
    `}</style>
  </div>
);

export default Header;
