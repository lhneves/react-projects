import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { isEmail, isInt, isFloat } from 'validator';
import { useDispatch } from 'react-redux';
import { FaEdit, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from '../../services/axios';

import * as actions from '../../store/modules/auth/actions';

import Loading from '../../components/Loading';

import { Container } from '../../styles/GlobalStyles';
import { Form, ProfilePicture, Title } from './styled';

export default function Aluno({ match, history }) {
    const dispatch = useDispatch();

    const id = get(match, 'params.id', '');

    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [idade, setIdade] = useState('');
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [foto, setFoto] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!id) return;

        async function getData() {
            try {
                setIsLoading(true);
                const { data } = await axios.get(`/alunos/${id}`);
                const Foto = get(data, 'Fotos[0].url', '');

                setNome(data.nome);
                setSobrenome(data.sobrenome);
                setEmail(data.email);
                setIdade(data.idade);
                setPeso(data.peso);
                setAltura(data.altura);
                setFoto(Foto);

                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
                const status = get(err, 'response.status', 0);
                const errors = get(err, 'response.data.errors', []);

                if (status === 400) errors.map((error) => toast.error(error));
                history.push('/');
            }
        }

        getData();
    }, [id, history]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formErrors = false;

        if (nome.length < 3 || nome.length > 255) {
            toast.error('Nome deve ter entre 3 e 255 caracteres');
            formErrors = true;
        }

        if (sobrenome.length < 3 || sobrenome.length > 255) {
            toast.error('Sobrenome deve ter entre 3 e 255 caracteres');
            formErrors = true;
        }

        if (!isEmail(email)) {
            toast.error('E-mail inválido.');
            formErrors = true;
        }

        if (!isInt(String(idade))) {
            toast.error('Idade inválida');
            formErrors = true;
        }

        if (!isFloat(String(peso))) {
            toast.error('Peso inválido');
            formErrors = true;
        }

        if (!isFloat(String(altura))) {
            toast.error('Altura inválido');
            formErrors = true;
        }

        if (formErrors) return;

        try {
            setIsLoading(true);
            if (id) {
                //Put
                await axios.put(`/alunos/${id}`, {
                    nome,
                    sobrenome,
                    email,
                    idade,
                    peso,
                    altura,
                });
                toast.success('Aluno(a) editado(a) com sucesso!');
            } else {
                //Post
                await axios.post('/alunos/', {
                    nome,
                    sobrenome,
                    email,
                    idade,
                    peso,
                    altura,
                });
                toast.success('Aluno(a) criado(a) com sucesso!');
                history.push(`/`);
            }

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            const status = get(err, 'response.status', 0);
            const errors = get(err, 'errors', []);

            if (errors.length > 0) {
                errors.map((erro) => toast.error(erro));
            } else {
                toast.error('Erro desconhecido');
            }

            if (status === 401) dispatch(actions.loginFailure());
        }
    };

    return (
        <Container>
            <Loading isLoading={isLoading} />

            <Title>{id ? 'Editar aluno' : 'Novo aluno'}</Title>

            {id && (
                <ProfilePicture>
                    {foto ? (
                        <img src={foto} alt={nome} />
                    ) : (
                        <FaUserCircle size={180} />
                    )}
                    <Link to={`/fotos/${id}`}>
                        <FaEdit size={24} />
                    </Link>
                </ProfilePicture>
            )}

            <Form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Sobrenome"
                    value={sobrenome}
                    onChange={(e) => setSobrenome(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Idade"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Peso"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Altura"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                />
                <button type="submit">Enviar</button>
            </Form>
        </Container>
    );
}

Aluno.propTypes = {
    match: PropTypes.shape({}).isRequired,
    history: PropTypes.shape([]).isRequired,
};
