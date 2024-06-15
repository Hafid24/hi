import TaskArea, { CLIENT } from '../../components/TaskArea';
import Sidebar from '../../components/Sidebar';
import FAB from '../../components/FAB';
import Modal from '../../components/Modal';

import styles from './Home.module.css';
import { useEffect, useState } from 'react';

export default function Home() {
  const [modal, setModal] = useState(false);
  const [clients, setTodos] = useState<CLIENT[]>([]);
  const [edit, setEdit] = useState<CLIENT>();

  async function onSave(client: CLIENT) {
    const update = clients.find((el) => el.id === client.id);
    if (update) {
      await window.electron.updateCLIENT(client);
    } else {
      await window.electron.insertCLIENT(client);
    }

    await getAllCLIENTS();
    toggleModal();
  }

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

  function toggleModal() {
    if (modal) {
      setEdit(undefined);
    }

    setModal(!modal);
  }

  async function getAllCLIENTS() {
    const data = await window.electron.getAllCLIENT();

    if (data) {
      setTodos(data);
    }
  }

  useEffect(() => {
    getAllCLIENTS();
  }, []);

  return (
    <div className={styles.container}>
     {/* <Sidebar />
      <FAB onClick={toggleModal} />
      {modal && (
        <Modal onClose={toggleModal} onSave={onSave} initialData={edit} />
      )}*/}
      <TaskArea
        clients={clients}
        onCheck={onCheck}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </div>
  );
}
