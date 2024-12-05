import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductForm.css";
import axios from "axios";

export default function ProductForm() {
  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    descricao: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validatePrice = (value: string) => {
    const priceRegex = /^\d+(\.\d{0,2})?$/;
    return priceRegex.test(value) && parseFloat(value) > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePrice(formData.preco)) {
      setErrorMessage(
        "O preço deve ser um número maior que zero e com até duas casas decimais."
      );
      return;
    }
    setErrorMessage("");
    try {
      const response = await axios.post(
        "http://localhost:3000/produtos",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      alert("Produto criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      alert("Erro ao criar produto.");
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (validatePrice(value) || value === "") {
      setFormData({ ...formData, preco: value });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h1>Cadastrar Produto</h1>
      <label htmlFor="nome">Nome do Produto:</label>
      <input
        id="nome"
        type="text"
        name="nome"
        value={formData.nome}
        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        placeholder="Nome do Produto"
      />

      <label htmlFor="preco">Preço:</label>
      <input
        id="preco"
        type="text"
        name="preco"
        value={formData.preco}
        onChange={handlePriceChange}
        placeholder="Valor do Produto (ex: 10.55)"
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <label htmlFor="descricao">Descrição:</label>
      <textarea
        id="descricao"
        name="descricao"
        value={formData.descricao}
        onChange={(e) =>
          setFormData({ ...formData, descricao: e.target.value })
        }
        placeholder="Descrição que deseja do produto"
      />

      <button type="submit">Cadastrar Produto</button>

      <button
        type="button"
        onClick={() => navigate("/products")}
        className="view-products-button"
      >
        Ver produtos cadastrados
      </button>
    </form>
  );
}
