import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "./styles";
import api from "../../services/api";

export default function Repositorio() {
  const { repos } = useParams();
  // return <h1 style={{ color: "#fff" }}>{repositorio}</h1>;

  const [repositorio, setRepositorio] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const nomeRepo = repos;

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

      setRepositorio(repositorioData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }
    load();
  }, [repos]);
  return <Container></Container>;
}
