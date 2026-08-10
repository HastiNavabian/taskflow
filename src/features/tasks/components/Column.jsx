import TaskCard from './TaskCard';

function Column({title, tasks}) {
    return (
        <div>
            <h2>{title}</h2>
            {tasks.map((task) => (
                <TaskCard 
                key={task.id}
                id={task.id}
                title={task.title}
                status={task.status}
                />
            ))}
        </div>
    )
}

export default Column;