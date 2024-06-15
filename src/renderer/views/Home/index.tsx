import TaskArea, { CLIENT } from '../../components/TaskArea';
import Sidebar from '../../components/Sidebar';
import FAB from '../../components/FAB';
import Modal from '../../components/Modal';
import Table from '../../components/Table';

import styles from './Home.module.css';
import { useEffect, useState } from 'react';

export default function Home() {
  const [modal, setModal] = useState(false);
  const [clients, setClients] = useState<CLIENT[]>([]);
  const [client, setClient] = useState<CLIENT>({});
  const [edit, setEdit] = useState<CLIENT>();
  const [p, setP] = useState(false);

  useEffect(() => {
    const client: CLIENT = {
      name: 'lobna',
      total_amount: undefined,
      social_number: null,
      card_number: null,
    };

    test(client);
  }, []);

  useEffect( ()=> {
   insertClient(client)

  }, [client])

  const insertClient = async (client:CLIENT)=>{
    await window.electron.updateCLIENT(client);

  }
  const test = async (client: CLIENT) => {
    await window.electron.updateCLIENT({
      id: 2,
      name: 'sarah',
      social_number: 0o0,
      card_number: 44554,
      total_amount: 50,
    });

    const currentDate = new Date().toISOString().split('T')[0];

    await window.electron.insertCREDIT({
      date: currentDate,
      id_client: 2,
      name: undefined,
      amount: undefined,
    });

    //await window.electron.insertCLIENT(client);
    setP(true);
  };
  async function onSave(client: CLIENT) {
    const update = clients.find((el) => el.id === client.id);
    if (update) {
      //await window.electron.updateCLIENT(client);
    } else {
      //await window.electron.insertCLIENT(client);
    }

    await getAllCLIENTS();
    // toggleModal();
  }

  /*
  async function onCheck(id: number) {
    const newState = clients.find((client) => client.id === id);

    if (!newState) return;

    newState.status = newState.status === 1 ? 0 : 1;
    await window.electron.updateCLIENT(newState);
    await getAllCLIENTS();
  }

  async function onDelete(id: number) {
    await window.electron.deleteCLIENT(id);
    await getAllCLIENTS();
  }

  function onEdit(id: number) {
    const editTodo = clients.find((client) => client.id === id);
    if (editTodo) {
      setEdit(editTodo);
    }

    toggleModal();
  }
*/
  function toggleModal() {
    if (modal) {
      setEdit(undefined);
    }

    setModal(!modal);
  }

  function addClient(client: CLIENT){
      setClient(client)
  }

  

  async function getAllCLIENTS() {
    const data = await window.electron.getAllCLIENT();

    if (data) {
      setClients(data);
      console.log(clients)
    }
  }

  useEffect(() => {
    getAllCLIENTS();
  }, [p]);

  console.log(clients)
  return (
    <div className={styles.container}>
      {/* <Sidebar />
      <FAB onClick={toggleModal} />
      <TaskArea
        clients={clients}
        onCheck={onCheck}
        onDelete={onDelete}
        onEdit={onEdit}
      />



      */}

      <div className={styles.search_wraper}>
      {modal && (
        <Modal onClose={toggleModal} onSave={onSave} initialData={edit} />
      )}
        <Table _data={clients} addClient={addClient} toggleModal={toggleModal}></Table>
      </div>

      {/*clients.map((c: CLIENT)=> (<div><h1>{c.name}</h1>{'  '}<h1>{c.social_number}</h1></div>))*/}
    </div>
  );
}
