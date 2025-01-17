import React, { useState, useCallback, useEffect } from 'react';

import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';

import { Container, Form, SubmitButton, List, DeleteButton } from './styles';

// importar a api
import api from '../../services/api';

export default function Main() {

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    // Buscar
    useEffect(() => {
        const repoStorage = localStorage.getItem('repos');

        if(repoStorage) {
            setRepositorios(JSON.parse(repoStorage));
        }
    }, [])

    // Salvar alterações
    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(repositorios));


        // quando a variável repositorios sofrer alterações, vamos executar o código de cima
    }, [repositorios]);

    function handleinputChange(e) {
        setNewRepo(e.target.value);
        setAlert(null);

        

    }

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        setAlert(null);
     
        async function submit() {
            setLoading(true);
            try {

                // no try catch podemos jogar um erro
                if (newRepo === '') {
                    throw new Error('Você precisa indicar um repositório!');
                }
                const response = await api.get(`repos/${newRepo}`);

                // verifica se a pessoa quer adicionar um repositório que já existe
                const hasRepo = repositorios.find(repo => repo.name === newRepo);

                if(hasRepo) {
                    throw new Error('Repositório Duplicado');
                }
                const data = {
                    name: response.data.full_name,
                }

                setRepositorios([...repositorios, data])
                console.log('repositorios: ', repositorios)
                setNewRepo('');
            } catch (error) {
                setAlert(true);
                console.log(error);
            } finally {
                // aqui já deu tudo certo, já acabou
                // aqui acaba a requisição
                setLoading(false);
            }

            
        }
        submit();
       

    }, [newRepo, repositorios])

    const handleDelete = useCallback((repo) => {
        const find = repositorios.filter(r => r.name !== repo);
        setRepositorios(find);
    }, [repositorios]);

    return (
        <Container>
            <h1>
                <FaGithub size={25}/>
                Meus Repositórios
            </h1>

            <Form onSubmit={handleSubmit} error={alert}>
                <input 
                type='text'
                placeholder='Adicionar Repositório'
                value={newRepo}
                onChange={handleinputChange}
                
                
                />

                <SubmitButton loading={loading ? 1 : 0}>
                {loading ? (
                    <FaSpinner color='#fff' size={14}/>
                ) : (
                    <FaPlus color='#fff'/>
                )
                }

                    
                </SubmitButton>

            </Form>

            <List>
                {repositorios.map(repo => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick={() => handleDelete(repo.name)}>
                                <FaTrash size={14}/>
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <a href='#'>
                            <FaBars size={20}/>
                        </a>

                    </li>
                ))}
            </List>
        </Container>
        
    )
}