import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Owner, Loading, BackButton } from "./styles";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../services/api";

export default function Repositorio() {
  const { repositorio } = useParams();
  // return <h1 style={{ color: "#fff" }}>{repositorio}</h1>;

  const [repositorios, setRepositorios] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const nomeRepo = repositorio;
      console.log("nome", nomeRepo);

      // Vai fazer duas requisições ao mesmo tempo
      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: "open",
            per_page: 5,
          },
        }),
      ]);

      // console.log(repositorioData.data);
      // console.log(issuesData.data);

      setRepositorios(repositorioData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }
    load();
  }, [repositorio]);

  if (loading) {
    return (
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    );
  }
  return (
    <Container>
      <BackButton to="/">
        <FaArrowLeft color="#000" size={30} />
      </BackButton>
      <Owner>
        <img
          src={repositorios.owner.avatar_url}
          alt={repositorios.owner.login}
        />
        <h1>{repositorios.name}</h1>
        <p>{repositorios.description}</p>
      </Owner>
    </Container>
  );
}
