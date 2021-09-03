import './Sale.css'; // Css de estilização
import { useState, useEffect } from 'react'; // React Rooks
import AddClient from './AddClient'; // importado o componente AddClient que é responsável por se criar clientes

// Componente de realizar vendas (Sale)
function Sale(props) {
  // ** variáveis de estado ** 

  // lista de clientes para selecionar na venda
  const [clients, setClients] = useState([]);

  // lista de produtos disponíveis
  const [products, setProducts] = useState([]);

  // ID do cliente selecionado que será utilizado para cadastrar a venda
  const [selectedClientID, setSelectedClientID] = useState('');

  // ID do produto atualmente selecionado que será adicionado ao insertProductIDs 
  const [selectedProductID, setSelectedProductID] = useState('');

  // Array com os IDs dos produtos que serão inseridos nos itens da venda.
  const [insertProductIDs, setInsertProductIDs] = useState([]);

  // Variável boleana que determina se o formulário de criar novo cliente deve ser exibido
  const [addClient, setAddClient] = useState(false);

  function clearForm() {
    // limpa o clienteId selecionado
    setSelectedClientID('');
    // limpa o productId selecionado
    setSelectedProductID('');
    // limpa o array de productIDs (itens da venda)
    setInsertProductIDs([]);
  }

   // função que carrega da API a lista de clientes e guarda em "clients"
   function loadClients() {
    // busca lista de clientes da api, passando o "props.employee.token" como token JWT no cabeçalho da requisição
    return fetch('http://localhost:3000/api/clients', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.employee.token}`
      }
    }).then( (res) => {
      res.json().then(json => {
        // setar clientes para a lista retornada pela API
        setClients(json.clients);
      });
    });
  }
  // função que carrega a lista de produtos da API
  function loadProducts() {
    // realiza a busca de produtos da API, passando o "props.employee.token" como token JWT no cabeçalho da requisição 
    fetch('http://localhost:3000/api/products/search', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.employee.token}`
      }
    }).then(res => {
      if (res.ok) {
        res.json().then(json => {
          // setar a lista de produtos disponível para a lista retornada pela API
          setProducts(json.products);
        })
      }
    })
  }
  // Função que é passada para o AddClient executar quando um cliente é criado.
  // Ela deve ser passada par ao component AddClient e só é chamada se o usuário não cancelar a operação e efetivamente criar o cliente
  function clientCreated(clientID) {
    // como um novo cliente foi adicionado, atualizar a lista de clientes com loadClients()
    loadClients()
    .then(() => {
      // Quando o componente AddCliente executar essa função, ele passará o ID do cliente que ele criou pela API no parâmetro.
      // Isso permite que possamos definir que o cliente selecionado no SELECT será o que acabou de ser adicionado
      setSelectedClientID(clientID);
      // seta addCliente para falso, para que o componente AddClient não seja mais exibido (já que seu trabalho foi finalizado)
      setAddClient(false);
    }); 
  }
   // função que o componente AddClient executar caso o usuário cancele a operação
  // Somente seta addCliente para false, ou seja, a interfave vai reagir e esconder, já que sua exibição depende desse boleano ser 'true'
  function cancelCreateClient() {
    setAddClient(false);
  }
  // Effect Hook que carreta os clientes e produtos assim que o formulário iniciar (já que addClient mudará de valor) ou se ele mudar de valor posteriomente.
  // Isso garante que o componente iniciará com os dados de clientes e produtos carregados
  useEffect( () => {
    loadClients();

    loadProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addClient]);

  if (addClient) {
    // caso a variável addClient seja true, exibir o componente de adicionar cliente (AddClient)
    // É passado par ao componente AddCliente:
    // * employee logado
    // clientCreated que é a função que será chamada quando se criar um cliente (essa função está implementada nesse componente (Sale.js) mais acima)
    // cancelCreateClient que é a função que será chamada quando se cancelar a criação de um cliente (essa função está implementada nesse componente (Sale.js) mais acima)
    return <AddClient employee={props.employee} clientCreated={clientCreated} cancelCreateClient={cancelCreateClient} />
  }

  //Caso  addClient seja 'false' chega aqui, ou seja será retornado o furmulário de adicionar nova venda.
  return (
    <div className="Sale">
      <h1>PetTopStore - PDV</h1>
      <div className="UserBox">
        <div>
          {/* Mostra o nome do funcionário logado (que foi passado por atributo (props)) */}
          Logado como {props.employee.name}
        </div>

        {/* Botão de sair do sistema. Simplesmente chama props.setEmployee(null), removendo a informação do usuário logado.
        essa função setEmployee foi passada para Sale por atributo props pelo App.js
        */}
        <button
          className="logoutButton"
          onClick={e => props.setEmployee(null)}
        >
          Sair do sistema
        </button>
      </div>

      {/* Formulário de adicionar nova venda */}
      <h2>Nova venda</h2>
      <div>
        Selecione um cliente
        {/* Select com o valor associado a selectedClientId, ao mudar troca o selectedClientId,

        os options são mapeados a partir da lista de clietnes disponíveis carregada da API (clients)
        */}
        {/* <select value={selectedClientID} onChange={(e) => {
            setSelectedClientID(e.target.value);
          }}>
          <option value=""> Escolha um cliente</option>
          {clients.map((client) => 
            <option key={client.id} value={client.id}>{client.name}</option>
          )}
        </select> */}

        {/* Se clicar em "Cadastraor novo cliente" é setada addCliente para true, o que faz o componente correspondente aparecer */}
        <button
          className="success"
          onClick={() => {
            setAddClient(true);
          }}
        >
          Cadastrar um novo cliente
        </button>

        <h3>Inserir item na venda</h3>
        <div>
          Selecione um produto 
          {/* select com os produtos da API. Ao se selecionar ele muda selectedProductID */}
          <select value={selectedProductID} onChange={(e) => {
            setSelectedProductID(e.target.value);
          }}>
            <option value="">Escolha um produto</option>
            {/* Uma opção para cada produto disponível que veio da API */}
            {products.map((product) => 
              <option key={product.id} value={product.id}>{product.name}</option>
            )}
          </select>

          {/* Botão para se inserir o selectedProductID (associado ao select acima) em productIDs que representa os itens da venda */}
          <button
            className="success"
            onClick={() => {
              if (selectedProductID) {
                setInsertProductIDs([
                  ...insertProductIDs,
                  selectedProductID
                ]);
                setSelectedProductID('');
              }
          }}>
            [+] Inserir
          </button>
          <br/>

          <h4>Produtos inseridos</h4>
          <ul>
            {/* Mostra reativamente os produtos escoilhidos, para cada item em insertProductIDs, criar um LI com nome*/}
            {insertProductIDs.map((productID) => {
              const product = products.find(p => p.id === parseInt(productID));
              return <li key={product.id}>{product.name}</li>
            })}
          </ul>

          <button
            className="success"
            onClick={() => {
            // Tenta finalizar a venda (efetivar na API)

            // valida se existe cliente selecionado
            if (selectedClientID === '') {
              alert('Selecione um cliente');
              return;
            }

            // verificar se existe algum produto em adicionado em insertProductIDs
            if (insertProductIDs.length === 0){
              alert('Adicione pelo menos um produto');
              return;
            }

            // cria nova venda na API passando o ID do cliente selecionado (selectedClientID) e a lista de IDs de produtos (insertProductIDs)
            fetch('http://localhost:3000/api/sales',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${props.employee.token}`
              },
              body: JSON.stringify({
                client_id: selectedClientID,
                productIDs: insertProductIDs
              })
            }).then(res => {
              if (res.ok) {
                res.json().then(json => {
                  alert('venda realizada com sucesso!');
                })
              } else {
                alert('venda não concluída');
              }
              clearForm();
            })
          }}>
            Finalizar vendas
          </button>
        </div>

      </div>
    </div>
  );
}

export default Sale;