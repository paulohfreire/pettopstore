import './Login.css';
import { useState } from "react";

// Componente login
function Login(props) {

  // variáveis de estado (email e password) com valores iniciais em branco
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // função que realiza o login na API com o uso do fetch
  function do_login() {
    fetch('http://localhost:3000/api/auth/employee/sign_in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then((res) => {
      if (res.ok) {
        // caso o login tenha acontecido com sucesso
        // altera o valor de employee com o uso do setEmployee
        res.json().then(json => {
          props.setEmployee(json.employee);
        })        
      } else {
        // Em caso de falha, exibir uma mensagem de erro
        alert('E-mail/senha iválidos');
      }
    })
  }

  // Retorna um JSX que mostra um formulário de login com os INPUTS associados às variáveis 
  // de estado email e password
  // o botão "Entrar" inicial o processo de login chamando "do_login" quando clicado.
  return (
    <div className="Login">
      <h1>PetTopStore</h1>
      <h2>PDV - Autenticação</h2>
      <div className="LoginBox">
        Email:
        <input
          name="email"
          type="email"
          value={email}
          onInput={e => setEmail(e.target.value)}
        /><br/>
        Password:
        <input
          name="password"
          type="password"
          value={password}
          onInput={e => setPassword(e.target.value)}
        /><br/>
        <button
          onClick={do_login}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}

export default Login;