import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Owner,
  Loading,
  BackButton,
  IssuesList,
  PageActions,
} from "./styles";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../services/api";

export default function Repositorio() {
  const { repositorio } = useParams();
  // return <h1 style={{ color: "#fff" }}>{repositorio}</h1>;

  const [repositorios, setRepositorios] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // aqui eu vou armazenar as páginas que estou atualmente
  const [page, setPage] = useState(1);

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
      console.log(issuesData.data);
      setLoading(false);
    }
    load();
  }, [repositorio]);

  useEffect(() => {
    async function loadIssue() {
      const nomeRepo = repositorio;
      const response = await api.get(`/repos/${nomeRepo}/issues`, {
        params: {
          state: "open",
          page,
          per_page: 5,
        },
      });
      setIssues(response.data);
    }
    loadIssue();
  }, [page, repositorio]);

  function handlePage(action) {
    setPage(action === "back" ? page - 1 : page + 1);
  }

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

      <IssuesList>
        {issues.map((issue) => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />

            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a>
                {/* {issue.labels.map((label) => (
                  <span key={String(label.id)}>{label.name}</span>
                ))} */}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>

      <PageActions>
        <button
          type="button"
          onClick={() => handlePage("back")}
          disabled={page < 2}
        >
          Voltar
        </button>
        <span>Página: {page}</span>
        <button type="button" onClick={() => handlePage("next")}>
          Próxima
        </button>
      </PageActions>
    </Container>
  );
}
