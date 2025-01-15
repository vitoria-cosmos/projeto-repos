import React, { useState, useCallback } from 'react';

import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';

import { Container, Form, SubmitButton, List, DeleteButton } from './styles';

// importar a api
import api from '../../services/api';

export default function Main() {

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);

    function handleinputChange(e) {
        setNewRepo(e.target.value);

        

    }

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
     
        async function submit() {
            setLoading(true);
            try {
                const response = await api.get(`repos/${newRepo}`)
                const data = {
                    name: response.data.full_name,
                }

                setRepositorios([...repositorios, data])
                console.log('repositorios: ', repositorios)
                setNewRepo('');
            } catch (error) {
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

            <Form onSubmit={handleSubmit}>
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