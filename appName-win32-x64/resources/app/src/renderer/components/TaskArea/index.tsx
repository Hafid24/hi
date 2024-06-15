import TaskItem from '../TaskItem';

import styles from './TaskArea.module.css';

export type CLIENT = {
  id?: number;
  title: string;
  date: string;
  status: number;
};

export default function TaskArea({
  clients,
  onCheck,
  onDelete,
  onEdit,
}: {
  clients: CLIENT[];
  onCheck: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  return (
    <div className={styles.container}>
      {clients.map((client) => (
        <TaskItem
          checked={client.status === 1 ? true : false}
          date={client.date}
          label={client.title}
          key={client.id}
          id={client.id}
          onChange={onCheck}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
