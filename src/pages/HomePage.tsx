import Header from "../components/Header/Header";
import NavBar from "../components/NavBar/NavBar";

function HomePage() {
  return (
    <>
      <Header
        title="Mi Micro"
        logo="/logo.png"
      />

      <NavBar />

      <main>
        <section id="para-que">
          <h1>Página principal</h1>
          <p>Encuentra la parada más cercana y descubre cómo llegar a tu destino.</p>
        </section>

        <section id="porque">
          <h2>¿Por qué?</h2>
        </section>

        <section id="ayuda">
          <h2>Ayuda</h2>
        </section>

        <section id="mas-info">
          <h2>Más información</h2>
        </section>
      </main>
    </>
  );
}

export default HomePage;
