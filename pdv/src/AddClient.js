import { useState } from 'react';

// Componente que cria novos clientes
function AddClient(props) {

  // ** variáveis de estado **
  // nome do novo cliente
  const [name, setName] = useState('');
  // email do novo cliente
  const [email, setEmail] = useState('');
  // senha do novo cliente
  const [password, setPassword] = useState('');

  // função que salva novo cliente na API
  function salvarCliente() {
    // tenta salvar o cliente na API com o uso do fetch enviando o nome, email e senha
    // é passado no cabeçalho o "props.employee.token" que é o token JWT do employee (funcionário logado)
    fetch('http://localhost:3000/api/auth/client/registration', {
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.employee.token}`
      },
      body: JSON.stringify({ name, email, password })
    }).then(res => {
      if (res.ok) {
        alert('cliente salvo com sucesso');
        res.json().then(json => {
          // caso o cliente seja cadastrado na API com sucesso
          // é executada a função clientCreated passando por parâmetro o ID do cliente cadastrado que retornou da API
          // essa função está dentro de props, ou seja, ela foi passada para esse componente (AddCliente) mas está implementada em Sale
          props.clientCreated(json.clienteID)
        });
      } else {
        alert('falha ao salvar cliente');
        // Ao falhar a criação do cliente informa ao Sale que o processo está cancelado
        // e então esse componente irá sumir da tela
        props.cancelCreateClient();
      }
    })
  }

  // retorna um JSX com um formulário com o nome/email/senha do novo cliente associado às variáveis relacionadas
  return (
    <div>
      <h2>Novo cliente</h2>
      <div>
        Nome: <input name="name" value={name} onInput={(e) => {
          setName(e.target.value);
        }}/><br/>
        E-Mail: <input name="email" value={email} onInput={(e) => {
          setEmail(e.target.value);
        }}/><br/>
        Senha: <input name="password" type="password" value={password} onInput={(e) => {
          setPassword(e.target.value);
        }}/><br/>
        <button onClick={salvarCliente}>
          Salvar cliente
        </button>
        <button onClick={() => {
          // Se desistir do cadastro informar ao Sale que foi cancelado chamando props.cancelCreateClient()
          // essa função foi passada como atributo da para o AddCliente e está implementada em Sale
          props.cancelCreateClient()
        }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default AddClient;