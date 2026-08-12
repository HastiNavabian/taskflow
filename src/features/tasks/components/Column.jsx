import TaskCard from './TaskCard';

function Column({title, tasks, onStatusChange}) {
    return (
        <div className="column">
            <h2>{title}</h2>
            {tasks.map((task) => (
                <TaskCard 
                key={task.id}
                id={task.id}
                title={task.title}
                status={task.status}
                onStatusChange={onStatusChange}
                />
            ))}
   
        </div>
    )
}

export default Column;