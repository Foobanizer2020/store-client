import InvoicesView from "./components/invoices/InvoicesView";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <article className="container mt-5">
        <InvoicesView />
      </article>
    </div>
  );
}

export default App;
