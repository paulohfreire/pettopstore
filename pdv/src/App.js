import './App.css'; // Importando um CSS para estilizar o App
import Sale from './Sale'; // Importando o componente de venda
import Login from './Login'; // Importando o componente de login
import { useState, useEffect } from 'react'; // React Rooks useState e useEffect

// função auxiliar que determina se um token JWT está próximo de expirar (falta 1 hora ou menos)
function isTokenOld(jwt) {

  // converte o payload do JWT para um objeto Javascript
  const payload = JSON.parse(Buffer.from(jwt.split(".")[1], 'base64').toString('binary'));

  // Calcula a expiração baseado no atributo "exp" o token. Esse foi seratado quando se assinou o token com a expiração de 2 dias(se assim você fez)
  const expiration = new Date(payload.exp * 1000);
  const now = new Date();
  const oneHour = 1000 * 60 * 60;

  // verifica se o token está próximo de expirar(menos de 1 hora), baseado na sua expiração e na data atual
  if( expiration.getTime() - now.getTime() < oneHour ){
    return true;
  } else {
    return false;
  }
}

// Componente principal App
function App() {

  // Estamos criando a variável de estado "employee" usando o useState de forma especial
  // Aqui o useState recebe uma função como valor inicial.
  // isso siginifica que o retorno dessa função será o valor inicial de employee.
  const [employee, setEmployee] = useState(() => {
    // O que essa função faz é verificar se "employee" está no localStorage do navegador
    const saved = localStorage.getItem("employee");
    const employeeJSON = JSON.parse(saved);

    // se ele estiver no localStorage, então vamos verificar se o token desse employee está perto de expirar
    if (employeeJSON) {
      if (isTokenOld(employeeJSON.token)){
        // se o token é antivo (está perto de expirar), retornamos um valor inicial fazio '' para o estado inicial de employee
        return '';
      }
    }

    // caso contrário retornamos o employeeJSON que contém o funcionário salvo no localStorage, ou em branco se ele não existir no localStorage ainda (nunca foi feito login nesse navegador)
    return employeeJSON;
  });

  // Estamos agora usando o useEffect da seguitne maneira:
  // Se employee mudar, ou seja, o login for realizado pela API e ele receber o valor de retorno
  // então essa função abaixo passada ao useEffect será executara
  // e ela seta a chave 'employee' no localStorage do navegador para o valor que a variável employee tem.
  // Essa estratégia, junto ao useState do employee, faz com que seu valor fique sempre sincronizado com o que está salvo no localStorage.
  useEffect(() => {
    localStorage.setItem("employee", JSON.stringify(employee));
  }, [employee]);

  // Finalmente verificamos se employee existe. 
  if (employee) {
    //Se for o caso ele já está logado e o token não está próximo de expirar()
    // retornar o componente de realizar venda (Sale)
    // Repare que passamos tanto a variável de estaod "employee" como o setEmployee para o componente Sale, permitindo que ele tenha acesso a esses dados que são de responsabilidade desse componente.
    return <Sale employee={employee} setEmployee={setEmployee} />
  } else {
    // Se não for o caso, o funcionário não está logado ou seu token está próximo de expirar.
    // Retornar o Login.js euq tem o formulário de login.
    // Repare que passamos tanto a variável de estaod "employee" como o setEmployee para o componente Login, permitindo que ele tenha acesso a esses dados que são de responsabilidade desse componente.
    return <Login employee={employee} setEmployee={setEmployee} />
  }

}

export default App;