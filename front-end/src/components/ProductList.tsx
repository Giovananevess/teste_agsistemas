import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./ProductList.css";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
}

const ProductTable: React.FC<{ products: Product[] }> = React.memo(
  ({ products }) => {
    console.log("Tabela renderizada");
    return (
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.nome}</td>
              <td>{Number(product.preco).toFixed(2)}</td>
              <td>{product.descricao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
);

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/produtos");
        setProducts(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchProducts();
  }, []);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  return (
    <div className="product-list">
      <h1>Lista de Produtos</h1>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="view-products-button"
      >
        Cadastrar Novo Produto
      </button>
      <ProductTable products={paginatedProducts} />
      <div className="pagination">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default ProductList;
