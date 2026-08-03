import Header from "../components/Header/Header";

function HomePage() {
  return (
    <>
      <Header
        title="Mi Micro"
        logo="/logo.png"
      />

      <main>
        <h1>Página principal</h1>
        <p>Bienvenido a la aplicación.</p>
      </main>
    </>
  );
}

export default HomePage;