import Head from "next/head";
const Header = () => (
  <div>
    <Head>
      <script async defer src="https://apis.google.com/js/api.js" />
      <script src="https://apis.google.com/js/api.js" />
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossOrigin="anonymous"
      />
      <link
        href="http://fonts.googleapis.com/css?family=Lato:400,700"
        rel="stylesheet"
        type="text/css"
      />
      <link
        href="https://unpkg.com/react-tabs/style/react-tabs.css"
        rel="stylesheet"
        type="text/css"
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
