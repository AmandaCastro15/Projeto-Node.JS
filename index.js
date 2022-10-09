const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const task = require('./models/task')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './sql/task-list.db' })
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).send('API Projeto TOTI, tabela para requisiçoes é tasks');
})

// List tasks
app.get('/tasks', async (req, res) => {
  
  try{
  const allTasks = await tasks.findAll()


  res.status(200).json({ allTasks })
  }
  catch(err){
    res.status(500).json({message: err.message})
  }

})

// Show task
app.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const task = await tasks.findByPk(taskId)

  try{
  
  if(task){
 
  res.status(200).json({task})
  return;
  
     }

  if(isNaN(taskId)){
    res.status(400).send('Id invalida insira numero enteiro para id')
    return;
   }
 
  else{

    res.status(400).send('tarefa não encontrada')
    return;
  
     
  }
}
  catch(err){
    res.status(500).json({message: err.message})
  }

})

app.post('/tasks', async (req, res) => {
  const { description, done} = req.body

  try{
  
  if(description == null || done == null){
    res.status(400).send("os valores inseridos não são corretos, precisa de description e de done")
    return;
  }
    
    if(description == true || description == false || !isNaN(description)){
    res.status(400).send("o valor de description tem que ser String")
      return;
  }


  else{
    if(done == true || done == false){
  const newtask = await tasks.create({
    description,
    done
  })
  res.status(200).send('cadastro pronto')
      return;
  }
    else{
      res.status(400).send("o valor do done tem que ser boolean insira de novo valor correto")
    }
}
  }
  catch(err){
    res.status(500).json({message: err.message})
  }
  
  })



// Update task
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const task = await tasks.findOne({ where: { id: taskId}});
  const { description, done} = req.body;

  try{
  
  if(isNaN(taskId)){
    res.status(400).send('Id invalida insira numero enteiro para id')
    return;
   }
  if(!task){
    res.status(400).send('tarefa não encontrada')
    return;
  }
    if(description == true || description == false || !isNaN(description)){
    res.status(400).send("o valor de description tem que ser String")
      return;
  }
    
  if(done == null){
    task.set(req.body);
  await task.save();
  res.status(200).send('tarefa atualizada');

  }
  else{

  if(done == true || done == false){
    task.set(req.body);
  await task.save();
  res.status(200).send('tarefa atualizada');
  }
  else{
    res.status(400).send('valor do done é invalido, tem que ser boolean')
  }
}
  
}

catch(err){
  res.status(500).json({message: err.message})
}

})


// Delete task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const task = await tasks.findByPk(taskId);

  try{

  if(task){
  await tasks.destroy({ where: { id: taskId}});
  res.status(200).send('tarefa excluida')
  return;
  }

  if(isNaN(taskId)){
    res.status(400).send('Tarefa Invalida, insira numero enteiro')
    return;
   }

  else{
    res.status(400).send('Tarefa não existe')
    return;
  }
}

catch(err){
  res.status(500).json({message: err.message})
}

})

app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})

